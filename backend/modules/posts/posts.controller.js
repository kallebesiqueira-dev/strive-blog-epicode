const postService = require('./posts.service')


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
        console.log(e)
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

        response.status(201)
            .send({
                statusCode: 201,
                post
            })
    } catch (e) {
        console.log(e)
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
    deleteOne,
    uploadOnDisk,
    uploadFileOnCloud,
}