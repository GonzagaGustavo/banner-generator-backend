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

module.exports = router