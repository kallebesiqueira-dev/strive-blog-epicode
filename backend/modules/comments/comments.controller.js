const commentService = require('./comments.service')
const PostNotFoundException = require('../../exceptions/posts/PostNotFoundException')
const CommentNotFoundException = require('../../exceptions/comments/CommentNotFoundException')

const getByPost = async (request, response, next) => {
    try {
        const { id } = request.params
        const comments = await commentService.getByPost(id)

        if (comments === null) {
            throw new PostNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                comments
            })
    } catch (e) {
        next(e)
    }
}

const getOne = async (request, response, next) => {
    try {
        const { id, commentId } = request.params
        const comment = await commentService.getOne(id, commentId)

        if (!comment) {
            throw new CommentNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                comment
            })
    } catch (e) {
        next(e)
    }
}

const create = async (request, response, next) => {
    try {
        const { id } = request.params
        const body = { ...request.body }

        if (request.user) {
            body.author = request.user._id
        }

        const comment = await commentService.create(id, body)

        if (comment === null) {
            throw new PostNotFoundException()
        }

        response.status(201)
            .send({
                statusCode: 201,
                comment
            })
    } catch (e) {
        next(e)
    }
}

const update = async (request, response, next) => {
    try {
        const { id, commentId } = request.params
        const comment = await commentService.update(id, commentId, request.body)

        if (!comment) {
            throw new CommentNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                comment
            })
    } catch (e) {
        next(e)
    }
}

const remove = async (request, response, next) => {
    try {
        const { id, commentId } = request.params
        const comment = await commentService.remove(id, commentId)

        if (!comment) {
            throw new CommentNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                message: `Comment with id ${commentId} deleted successfully`
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getByPost,
    getOne,
    create,
    update,
    remove,
}
