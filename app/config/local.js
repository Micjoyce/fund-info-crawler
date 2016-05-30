module.exports = {
    dbHost: '192.168.99.100',
    port: 3306,
    dialect: 'mysql',
    user:'root',
    password: 'password',
    dbLogging: process.env.DB_LOG ? console.log : false
};
