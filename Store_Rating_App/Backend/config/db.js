const mysql = require("mysql2");

const connection = mysql.createPool({
  host: 'localhost',
  user: 'nisha',
  password: 'nisha',
  database: 'store_rating_db'
});

module.exports = connection.promise();