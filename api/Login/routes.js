const connection = require('../connection')
const router = require('express').Router()


router.get("/", (req, res) => {
    connection.query("SELECT * FROM usuarios;", (err, results) => {
        if(err) {
            console.log(err)
        } else {
            res.send(results)
        }
    })
})
router.post("/delete", (req, res) => {
    connection.query(`DELETE FROM usuarios WHERE usuarios.id = ${req.body.id}`, (err) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Usuário Excluido")
        }
    })
})
router.post("/login", (req, resp) => {
    connection.query(
      `SELECT * FROM usuarios WHERE email LIKE '${req.body.email}' AND senha LIKE '${req.body.senha}'`,
      (err, results) => {
        if (results.length === 0) {
          resp.send(false);
        } else {
          resp.send(true);
        }
      }
    );
  });

module.exports = router