require('module-alias/register');

const morgan = require('morgan'); // Logger
const cors = require('cors'); // Cross-origin resource sharing
const helmet = require('helmet');

const path = require('path'); 
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`)});

const express = require('express');

// Custom middleware
const app = express();
const dbCreate = require('@root/config/connection');
const db = require('@root/models');
const authorize = require('@middleware/authorize');
const { log } = require('console');

app.use(morgan(function (tokens, req, res) {
    if (process.env.NODE_ENV === 'development') {
        return [
            '\u001b[31m -------------------------\n',
            '------ REQUEST END ------\n',
            '-------------------------\u001b[0m\n',
            '\u001b[1mMETHOD\u001b[0m: ' + tokens.method(req, res),
            '\n \u001b[1mURL\u001b[0m: ' + tokens.url(req, res),
            '\n \u001b[1mSTATUS\u001b[0m: ' + tokens.status(req, res),
            '\n \u001b[1mLENGTH\u001b[0m: ' + tokens.res(req, res, 'content-length'), '-',
            '\n \u001b[1mTIME\u001b[0m: ' + tokens['response-time'](req, res), 'ms',
            '\n \u001b[31m-------------------------\u001b[0m'
        ].join(' ')
    }
}));

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(authorize.checkTokenSetUser);

// PUBLIC
app.use('/', require('@routes'));

// AUTHENTICATION
app.use('/auth', require('@routes/auth.js'));

// PUBLIC & PRIVATE
app.use('/users', require('@routes/users.js'));
app.use('/points', require('@routes/points.js'));
app.use('/rewards', require('@routes/rewards.js'));
app.use('/tasks', require('@routes/tasks.js'));

// Error handling

// Route is not found
function notFound(req, res, next) {  
    res.status(404);
    const error = new Error(`Not found: ${req.originalUrl}`);
    next(error);
}

// Returns error via JSON
function errorHandler(err, req, res, next) {  
    res.status(res.statusCode || 500);

    console.log(err);
    

    res.json({
        success: false,
        status: res.statusCode || 500,
        error: {
            message: `${err.message}`,
            errors: err.errors
        }
    });
}

app.use(notFound);
app.use(errorHandler);


// Connect
const port = process.env.port || 5000;

app.listen(port, () => {
    dbCreate()
        .then(() => {
            db.sequelize.sync();
        })
        .catch((err) => {
            console.log(err);
        });
    
});