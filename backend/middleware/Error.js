const { errorMonitor } = require('nodemailer/lib/ses-transport/index.js')
const ErrorHandler = require('../utils/ErrorHandler.js')
const { JsonWebTokenError } = require('jsonwebtoken')

module.exports = (req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // Wrong Mongodb Id Error
    if(err.name === "CastError") {
        const message = `Resoources not found with this id ${err.path}`
    }

    // Duplicate Key Error
    if(err.code === 11000) {
        const message = `Duplicate Key ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }

    // Wrong JWT Error
    if(err.name === "JsonWebTokenError") {
        const message = 'Your URL is invalid, please try again'
        err = new ErrorHandler(message, 400)
    }

    // JWT Expired
    if(err.name === "TokenExpiredError") {
        const message = 'Your URL is expired, please try again'
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}