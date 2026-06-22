const userService = require('./users.service')
const {sendEmail , sgtSend} = require('../email/index')
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
        const {body} = request
        const user = await userService.createUser(body)

        /*await sgtSend(
            'markoxaser@gmail.com',
            'NEW USER REGISTERED',
            `A new user is registered: ${user.firstName}`
        )*/

        await sendEmail(
            'rosalyn.hammes@ethereal.email',
            'NEW USER REGISTERED',
            `A new user is registered: ${user.firstName}`
        )

        response.status(201)
            .send({
                statusCode: 201,
                user
            })
    } catch (e) {
        console.log(e)
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
    updateOne,
    deleteOne,
}