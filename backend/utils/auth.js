const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const jwt = require("jsonwebtoken")
const User = require("../model/user")

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies
    if(!token) {
        return next(new ErrorHandler("Please login to continue"))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
})