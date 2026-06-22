const express = require('express')
const users = express.Router()
const userController = require('./users.controller')
const { userBodyValidation, userBodyValidator } = require('../../middlewares/users/validateUserBodyMiddleware')



users.get('/users', userController.getUsers)
users.get('/users/:id', userController.getById)
users.get('/search/users', userController.getByName)
users.get('/search/users/adults', userController.findUsersFromEighteenToTwenty)
users.get('/average', userController.getAverageAge)

users.post('/users', [userBodyValidation, userBodyValidator] , userController.create)


users.patch('/users/:id', userController.updateOne)

users.delete('/users/:id', userController.deleteOne)

module.exports = users