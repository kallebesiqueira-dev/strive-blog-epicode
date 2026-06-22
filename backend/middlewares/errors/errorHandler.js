const HttpException = require('../../exceptions/index')
const mongoose = require('mongoose')

const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpException) {
        return res.status(err.statusCode)
            .json({
                statusCode: err.statusCode,
                message: err.message,
                error: err.error
            })
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'Mongoose Error: object ID is invalid or malformed'
            })
    }

    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(err.statusCode ?? 400)
            .json({
                statusCode: err.statusCode ?? 400,
                message: 'Mongoose Error: One of more passed or required props failed the validation',
                errors: err.errors
            })
    }

    if (err.code === 11000) {
        return res.status(409)
            .json({
                statusCode: 409,
                message: 'Este email já está cadastrado. Faça login.'
            })
    }

    console.error('Unhandled error:', err.message)

    res.status(500)
        .json({
            status: 'Error',
            message: 'Internal server error',
            error: 'An error has occurred, please try again later or contact the developer.'
        })
}


module.exports = errorHandler