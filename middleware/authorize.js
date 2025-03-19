const jwt = require("jsonwebtoken");
const userService = require('@controllers/users/user.service');

async function checkTokenSetUser(req, res, next) {
    if (process.env.NODE_ENV === 'development') console.log('\u001b[32m -------------------------\n ----- REQUEST START -----\n -------------------------\u001b[0m',);

    const authHeader = req.get('Authorization');

    if (authHeader){
        const token = authHeader.split(" ")[1];

        if (token){
            jwt.verify(token, process.env.SECRET, (error, user) => {
                req.user = user;
            });
        }
    }

    if (!req.user) {
        next();
    } else {
        await userService.Get(req.user.id)
            .then((data) => {
                userRole = data.role.id
                req.user.role = userRole;

                next();
            })
            .catch((err) => {
                res.json({
                    success: false,
                    title: 'Invalid user',
                    message: err
                });
            });
    }
}

function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        unAuthorized(res, next);
    }
}

module.exports = {
    checkTokenSetUser,
    isLoggedIn,
};

function unAuthorized(res, next) {
    const error = new Error('You do not have access to this area. Log in to continue.');
    res.status(401);
    next(error);
}