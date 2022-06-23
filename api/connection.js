const mysql = require("mysql2");
const connection = mysql.createConnection({
  database: "banners",
  user: "61bhxvk86h74",
  host: "xa410lzs0nmn.aws-sa-east-1-1.psdb.cloud",
  password: "pscale_pw_t6w1X58oRZJ9PyL9gZFixfnmPA5CVLCKwt3Zn6QIUtY",
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
