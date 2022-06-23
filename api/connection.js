const mysql = require("mysql2");
const connection = mysql.createConnection({
  database: "banners",
  user: "88esy7j0xr91",
  host: "np0zi8nzgp2s.aws-sa-east-1-1.psdb.cloud",
  password: "pscale_pw_RnVTuJkhx6-231MNU2q9SIZbm-kQBxzSfyMN05h_6sg",
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

connection.query(
  "CREATE TABLE IF NOT EXISTS usuarios (id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(60) NOT NULL, email VARCHAR(60) NOT NULL, senha VARCHAR(80) NOT NULL, admin BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY(id)) ENGINE=innoDB"
);

module.exports = connection;
