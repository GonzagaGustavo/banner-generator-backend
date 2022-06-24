const connection = require("../connection");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.post("/create", (req, res) => {
  const senha = bcrypt.hashSync(req.body.senha, 8);
  connection.query(
    `INSERT INTO usuarios (nome, email, senha) VALUES ('${req.body.nome}', '${req.body.email}', '${senha}')`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Usuário Criado!");
      }
    }
  );
});

router.post("/", async (req, res) => {
  if (req.body.role == 4) {
    connection.query("SELECT * FROM usuarios;", (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  } else if (req.body.role == 3) {
    connection.query(
      `SELECT * FROM relacionamento WHERE relacionamento.admin_id = ${req.body.id}`,
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          let users = [];
          //   for (let i = 0; i < results.length; i++) {
          //     connection.query(
          //       `SELECT * FROM usuarios WHERE usuarios.id = ${results[i].user_id}`,
          //       (err, result) => {
          //         if (err) {
          //           console.log(err);
          //         } else {
          //           users.push(result);
          //         }
          //       }
          //     );
          //   }

          results.forEach((data) => {
            connection.query(
              `SELECT * FROM usuarios WHERE usuarios.id = ${data.user_id}`,
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  users.push(result);
                  console.log(users);
                }
              }
            );
          });
          console.log(users);
          res.send(users);
        }
      }
    );
  }
});
router.post("/upgradeToAdm", (req, res) => {
  connection.query(
    `UPDATE usuarios SET role = '3' WHERE usuarios.id = ${req.body.id}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Atualizado!");
      }
    }
  );
});
router.post("/upgradeToMember", (req, res) => {
  connection.query(
    `UPDATE usuarios SET role = '2' WHERE usuarios.id = ${req.body.idUser}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        connection.query(
          `INSERT INTO relacionamento (user_id, admin_id) VALUES (${req.body.idUser}, ${req.body.idAdmin})`,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              res.send("Atualizado!");
            }
          }
        );
      }
    }
  );
});
router.post("/downgrade");

router.post("/login", (req, res) => {
  connection.query(
    `SELECT * FROM usuarios WHERE email LIKE '${req.body.email}' AND senha LIKE '${req.body.senha}'`,
    (err, results) => {
      if (results.length === 0) {
        res.send(false);
      } else {
        res.send(true);
      }
    }
  );
});

module.exports = router;
