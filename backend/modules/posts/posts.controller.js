const postService = require('./posts.service')
const userService = require('../users/users.service')
const { sendEmail } = require('../email/index')
const PostNotFoundException = require('../../exceptions/posts/PostNotFoundException')


const findAll = async (request, response, next) => {
    try {
        const { page = 1, pageSize = 10 } = request.query
        const {
            posts,
            totalPosts,
            totalPages,
        } = await postService.findAll(page, pageSize)

        if (posts.length === 0) {
            return response.status(404)
                .send({
                    statusCode: 404,
                    message: 'Posts not found'
                })
        }

        response.status(200)
            .send({
                statusCode: 200,
                totalPosts: Number(totalPosts),
                totalPages: Number(totalPages),
                posts
            })
    } catch (e) {
        next(e)
    }
}

const findOne = async (request, response, next) => {
    try {
        const { id } = request.params
        const post = await postService.findOne(id)

        if (!post) {
            return response.status(404)
                .send({
                    statusCode: 404,
                    message: 'Posts not found'
                })
        }

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (e) {
        next(e)
    }
}

const create = async (request, response, next) => {
    try {
        const { body } = request
        const post = await postService.create(body)

        if (post.author) {
            const author = await userService.getById(post.author)
            if (author && author.email) {
                await sendEmail(
                    author.email,
                    'Your post has been published',
                    `<h1>Hi ${author.firstName}!</h1><p>Your post "${post.title}" has been published on Strive Blog.</p>`
                )
            }
        }

        response.status(201)
            .send({
                statusCode: 201,
                post
            })
    } catch (e) {
        next(e)
    }
}

const update = async (request, response, next) => {
    try {
        const { id } = request.params
        const { body } = request
        const post = await postService.update(id, body)

        response.status(200)
            .send({
                statusCode: 200,
                post
            })
    } catch (e) {
        next(e)
    }
}

const deleteOne = async (request, response, next) => {
    try {
        const { id } = request.params
        await postService.deleteOne(id)

        response.status(200)
            .send({
                statusCode: 200,
                message: `Post with id ${id} deleted successfully`
            })

    } catch (e) {
        next(e)
    }
}

const updateCover = async (request, response, next) => {
    try {
        const { id } = request.params

        if (!request.file) {
            return response.status(400)
                .send({ statusCode: 400, message: 'No image provided' })
        }

        const post = await postService.update(id, { cover: request.file.path })

        if (!post) {
            throw new PostNotFoundException()
        }

        response.status(200)
            .send({ statusCode: 200, post })
    } catch (e) {
        next(e)
    }
}

const uploadOnDisk = async (request, response, next) => {
    try {
        const url = `${request.protocol}://${request.get('host')}`
        const name = request.file.filename

        response
            .status(200)
            .json({
                statusCode: 200,
                message: 'Image uploaded successfully',
                img: `${url}/upload/${name}`
            })
    } catch (e) {
        next(e)
    }
}

const uploadFileOnCloud = async (request, response, next) => {
    try {
        response.status(200)
            .json({
                statusCode: 200,
                img: request.file.path
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    findAll,
    findOne,
    create,
    update,
    updateCover,
    deleteOne,
    uploadOnDisk,
    uploadFileOnCloud,
}