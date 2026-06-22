const HttpException = require('../index')

class PostNotFoundException extends HttpException {
    constructor(
        message = 'Strive Blog: Post not found',
        statusCode = 404,
        error = 'The requested post does not exist'
    ) {
        super(message, statusCode, error);
    }
}

module.exports = PostNotFoundException
