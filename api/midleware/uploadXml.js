const multer = require('multer')



module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname +'/../public')
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        const extensao = ['text/xml'].find(formatoAceito => formatoAceito == file.mimetype)

        if(extensao) {
            return cb(null, true)
        }

        return cb(null, false)
    }
}))