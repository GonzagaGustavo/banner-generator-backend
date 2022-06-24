const mysql = require("mysql2");
const connection = mysql.createConnection({
  database: "banner",
  user: "root",
  host: "localhost",
  // ssl: {
  //   require: true,
  //   rejectUnauthorized: false,
  // },
});

connection.query(
  "CREATE TABLE IF NOT EXISTS usuarios (id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(60) NOT NULL, email VARCHAR(60) NOT NULL, senha VARCHAR(80) NOT NULL, admin INT DEFAULT 1, PRIMARY KEY(id)) ENGINE=innoDB"
);

module.exports = connection;
