const ErrorHandler = require("../ErrorHandler")

const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error'
    if (err.name === 'CastError') {
        const message = 'Resource not found'
        err = new ErrorHandler(message, 400)
    }
    if (err.name === 11000) {
        const message = 'Duplicate Entered'
        err = new ErrorHandler(message, 400)
    }
    if (err.name === 'JSONWebTokenError') {
        const message = 'JSON web token is invalid'
        err = new ErrorHandler(message, 400)
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'JSON web token is Expired'
        err = new ErrorHandler(message, 400)
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}
module.exports = ErrorMiddleware