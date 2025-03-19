const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

async function initialize() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
    const connection = await mysql.createConnection({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\`;`);

    const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, { 
        host: DB_HOST, 
        port: DB_PORT,
        dialect: 'mysql',
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log(`Connection to ${DB_DATABASE} at ${DB_HOST}:${DB_PORT} has been established successfully.`);
    } catch (error) {
        console.error(`Unable to connect to ${DB_DATABASE} at ${DB_HOST}:${DB_PORT}`, error);
    }
}


module.exports = initialize;