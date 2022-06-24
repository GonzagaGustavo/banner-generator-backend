const mysql = require("mysql2");
const connection = mysql.createConnection({
  database: "banners",
  user: "lcxx2nyzseq4",
  host: "np0zi8nzgp2s.aws-sa-east-1-1.psdb.cloud",
  password: "pscale_pw_XrsM0vHQ4cCg8u7TzfE-7Gjjr17m6Ddk5-eoHLqYT_E",
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

connection.query(
  "CREATE TABLE IF NOT EXISTS usuarios (id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(60) NOT NULL, email VARCHAR(60) NOT NULL, senha VARCHAR(80) NOT NULL, admin BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY(id)) ENGINE=innoDB"
);

module.exports = connection;
