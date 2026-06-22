const HttpException = require('../index')

class CommentNotFoundException extends HttpException {
    constructor(
        message = 'Strive Blog: Comment not found',
        statusCode = 404,
        error = 'The requested comment does not exist'
    ) {
        super(message, statusCode, error);
    }
}

module.exports = CommentNotFoundException
