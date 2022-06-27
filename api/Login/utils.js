const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, 'Chave Secreta', {
        expiresIn: 60 * 60 * 24 * 365
    })
}

module.exports = generateToken