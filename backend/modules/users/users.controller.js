const jwt = require('jsonwebtoken')
const userService = require('./users.service')
const { sendEmail } = require('../email/index')
const UserNotFoundException = require('../../exceptions/users/UserNotFoundException')

const getUsers = async (request, response, next) => {
    try {
        const { page = 1, pageSize = 10 } = request.query
        const {
            totalUsers,
            totalPages,
            users,
        } = await userService.getUsers(page, pageSize)

        if (users.length === 0) {
            throw new UserNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                totalPages,
                totalUsers,
                page: Number(page),
                pageSize: Number(pageSize),
                users
            })
    } catch (e) {
        next(e)
    }
}


const getById = async (request, response, next) => {
    try {
        const {id} = request.params
        const user = await userService.getById(id)

        if (!user) {
            throw new UserNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                user
            })
    } catch (e) {
        next(e)
    }
}

const getByName = async (request, response, next) => {
    try {
        const { name } = request.query
        const user = await userService.getByName(name)

        if (user.length === 0) {
            throw new UserNotFoundException()
        }

        response.status(200)
            .send({
                statusCode: 200,
                user
            })
    } catch (e) {
        next(e)
    }
}


const findUsersFromEighteenToTwenty = async (request, response, next) => {
    try {
        const users = await userService.findUsersFromEighteenToTwenty()

        if (users.length === 0) {
            return response.status(404)
                .send({
                    statusCode: 404,
                    message: 'No users fond from 18 to 20 (age)'
                })
        }

        response.status(200)
            .send({
                statusCode: 200,
                users
            })
    } catch (e) {
        next(e)
    }
}

const getAverageAge = async (request, response, next) => {
    try {
        const averageAge = await userService.getAverageAge()
        response.status(200)
            .send({
                statusCode: 200,
                averageAge
            })
    } catch (e) {
        next(e)
    }
}


const create = async (request, response, next) => {
    try {
        const { body } = request
        const user = await userService.createUser(body)

        await sendEmail(
            user.email,
            'Welcome to Strive Blog',
            `<h1>Welcome, ${user.firstName}!</h1><p>Your account has been created successfully.</p>`
        )

        response.status(201)
            .send({
                statusCode: 201,
                user
            })
    } catch (e) {
        next(e)
    }
}

const login = async (request, response, next) => {
    try {
        const { email, password } = request.body
        const user = await userService.getByEmail(email)

        if (!user || !(await user.comparePassword(password))) {
            return response.status(401)
                .send({
                    statusCode: 401,
                    message: 'Invalid email or password'
                })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        )

        response.status(200)
            .send({ token })
    } catch (e) {
        next(e)
    }
}

const me = async (request, response, next) => {
    try {
        response.status(200)
            .send({
                statusCode: 200,
                user: request.user
            })
    } catch (e) {
        next(e)
    }
}

const updateAvatar = async (request, response, next) => {
    try {
        const { id } = request.params

        if (!request.file) {
            return response.status(400)
                .send({ statusCode: 400, message: 'No image provided' })
        }

        const user = await userService.updateOne(id, { avatar: request.file.path })

        if (!user) {
            throw new UserNotFoundException()
        }

        response.status(200)
            .send({ statusCode: 200, user })
    } catch (e) {
        next(e)
    }
}

const updateOne = async (request, response, next) => {
    try {
        const { id } = request.params
        const { body } = request
        await userService.updateOne(id, body)

        response.status(200)
            .send({
                statusCode: 200,
                message: `User with id ${id} updated successfully`
            })
    } catch (e) {
        next(e)
    }
}

const deleteOne = async (request, response, next) => {
    try {
        const { id } = request.params
        await userService.deleteOne(id)

        response.status(200)
            .send({
                statusCode: 200,
                message: `User with id ${id} deleted successfully`
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getUsers,
    getById,
    getByName,
    findUsersFromEighteenToTwenty,
    getAverageAge,
    create,
    login,
    me,
    updateAvatar,
    updateOne,
    deleteOne,
}