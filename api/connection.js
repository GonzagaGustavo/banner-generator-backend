const mysql = require("mysql2");
const connection = mysql.createConnection({
  database: "banners",
  user: "no47ntw4ccou",
  host: "np0zi8nzgp2s.aws-sa-east-1-1.psdb.cloud",
  password: "pscale_pw_Dz2sgjWLfCRxY24KDOsITXsEbanPUe_BM_UOjVuf0Sg",
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

connection.query(
  "CREATE TABLE IF NOT EXISTS usuarios (id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(60) NOT NULL, email VARCHAR(60) NOT NULL, senha VARCHAR(80) NOT NULL, admin BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY(id), UNIQUE email(email)) ENGINE=innoDB"
);

connection.query(
  "INSERT INTO usuarios (nome, email, senha, admin) VALUES ('Jose', 'admin@towty.com.br', 'towty102030', 1)"
);

module.exports = connection;
