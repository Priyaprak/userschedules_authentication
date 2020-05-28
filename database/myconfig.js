const mysql = require('mysql');

const pool= mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    
});
    
module.exports = pool;