const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, res, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = file.orginalname.split(".")[0]
        cb(null, filename + '-' + uniqueSuffix + '.png')
    }
})

exports.upload = multer({storage: storage})