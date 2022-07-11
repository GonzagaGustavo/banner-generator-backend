const connection = require("../connection");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const generateToken = require("./utils");
const jwt = require("jsonwebtoken");

router.post("/create", (req, res) => {
  connection.query(
    `SELECT * FROM usuarios WHERE usuarios.email='${req.body.email}'`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(results)
        if (results.length == 0) {
          
          const senha = bcrypt.hashSync(req.body.senha, 8);
          connection.query(
            `INSERT INTO usuarios (nome, email, senha, aceito_termos) VALUES ('${req.body.nome}', '${req.body.email}', '${senha}', ${req.body.checked ? 1 : 0})`,
            (err) => {
              if (err) {
                console.log(err);
              } else {
                res.send(true);
              }
            }
          );
        } else {
          res.send("Email já existe!")
        }
      }
    }
  );
});

router.post("/", async (req, res) => {
  const infos = jwt.verify(req.body.token, "Chave Secreta");
  if (infos.role == 4) {
    connection.query("SELECT * FROM usuarios;", (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  } else if (infos.role == 3) {
    connection.query("SELECT * FROM usuarios;", (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
    // connection.query(
    //   `SELECT * FROM relacionamento WHERE relacionamento.admin_id = ${infos.id}`,
    //   (err, results) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       let users = "";
    //       results.forEach((data) => {
    //         users += data.user_id + ",";
    //       });
    //       users = users.slice(0, -1);
    //       connection.query(
    //         `SELECT * FROM usuarios WHERE usuarios.id IN (${users})`,
    //         (err, result) => {
    //           if (err) {
    //             console.log(err);
    //           } else {
    //             res.send(result);
    //           }
    //         }
    //       );
    //     }
    //   }
    // );
  } else {
    res.send(false);
  }
});

router.post("/checkRole", (req, res) => {
  const info = jwt.verify(req.body.token, "Chave Secreta");
  if (info.role === 4) {
    res.send("4");
  } else if (info.role === 3) {
    res.send("3");
  } else if (info.role === 2) {
    res.send("2");
  } else if (info.role === 1) {
    res.send("1");
  }
});
router.post("/editVerify", (req, res) => {
  const info = jwt.verify(req.body.token, "Chave Secreta");
  connection.query(
    `SELECT * FROM relacionamento WHERE relacionamento.admin_id = ${info.id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
        res.send(results);
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
        if (results.length == 0) {
          res.send(false);
        } else {
          res.send(results[0]);
        }
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
router.post("/edit", (req, res) => {
  connection.query(
    `UPDATE usuarios SET nome='${req.body.values.nome}', role=${req.body.values.role}, email='${req.body.values.email}', can_create=${req.body.values.can_create} WHERE usuarios.id=${req.body.id}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Usuario editado!");
      }
    }
  );
});
router.post("/getCan_Create", (req, res) => {
  const info = jwt.verify(req.body.token, "Chave Secreta");
  connection.query(
    `SELECT can_create FROM usuarios WHERE usuarios.id=${info.id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});
router.post("/downCan_create", (req, res) => {
  const info  = jwt.verify(req.body.token, "Chave Secreta")
  connection.query(`SELECT can_create FROM usuarios WHERE usuarios.id=${info.id}`, (err, results) => {
    connection.query(`UPDATE usuarios SET can_create=${results[0].can_create - 1} WHERE usuarios.id=${info.id}`, (err) => {
      if(err) {
        console.log(err)
      }
    })
  })
})

router.post("/delete", (req, res) => {
  const info = jwt.verify(req.body.token, "Chave Secreta");
  connection.query(
    `SELECT role FROM usuarios WHERE usuarios.id IN (${req.body.ids})`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        for (let i = 0; i < req.body.ids.length; i++) {
          if (results[i].role >= info.role) {
          } else {
            connection.query(
              `DELETE FROM usuarios WHERE usuarios.id=${req.body.ids[i]}`,
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send("Deletado!");
                }
              }
            );
          }
        }
      }
    }
  );
});

module.exports = router;
