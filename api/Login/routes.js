const connection = require("../connection");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const generateToken = require("./utils");
const jwt = require('jsonwebtoken')

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
  const infos = jwt.verify(req.body.token, 'Chave Secreta')
  if (infos.role == 4) {
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
          let users = "";
          results.forEach((data) => {
            users += data.user_id + ",";
          });
          users = users.slice(0, -1);
          connection.query(
            `SELECT * FROM usuarios WHERE usuarios.id IN (${users})`,
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        }
      }
    );
  } else {
    res.send(false)
  }
});

router.post("/checkRole", (req, res) => {
  connection.query(
    `SELECT * FROM usuarios WHERE email LIKE '${req.body.email}'`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (bcrypt.compareSync(senha, user.senha)) {
          res.send("" + user.role);
        } else {
          res.send("0");
        }
      }
    }
  );
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
    `UPDATE usuarios SET role = 2 WHERE usuarios.id = ${req.body.idUser}`,
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

router.post("/downgrade", (req, res) => {
  connection.query(
    `UPDATE usuarios SET role = ${req.body.role} WHERE usuarios.id = ${req.body.idUser}`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
});

router.post("/login", (req, res) => {
  connection.query(
    `SELECT * FROM usuarios WHERE email LIKE '${req.body.email}'`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results.length == 0) {
          res.send(false);
        } else {
          if (bcrypt.compareSync(req.body.senha, results[0].senha)) {
            let saves = {
              id: results[0].id,
              token: generateToken(results[0]),
            };
            res.send(saves);
          } else {
            res.send(false);
          }
        }
      }
    }
  );
});

router.post("/getUser", (req, res) => {
  connection.query(
    `SELECT nome, email, role, can_create FROM usuarios WHERE usuarios.id=${req.body.id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results[0]);
      }
    }
  );
});

router.post("/editName", (req, res) => {
  connection.query(
    `UPDATE usuarios SET nome='${req.body.nome}' WHERE usuarios.id=${req.body.id}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Atualizado!");
      }
    }
  );
});

router.post("/editPass", (req, res) => {
  const senha = bcrypt.hashSync(req.body.senha, 8);
  connection.query(
    `UPDATE usuarios SET senha='${senha}' WHERE usuarios.id=${req.body.id}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Atualizado!");
      }
    }
  );
});

router.post("/editCanCreate", (req, res) => {
  connection.query(
    `UPDATE usuarios SET can_create='${req.body.creates}' WHERE usuarios.id=${req.body.id}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Atualizado!");
      }
    }
  );
});
router.post("/delete", (req, res) => {
  connection.query(`SELECT role FROM usuarios WHERE usuarios.id IN (${req.body.ids})`, (results, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results)
    }
  })

  // connection.query(`DELETE FROM usuarios WHERE usuarios.id IN (${req.body.ids})`, (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.send("Deletado!");
  //   }
  // })
})

module.exports = router;
