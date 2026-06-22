const express = require('express')
const comments = express.Router()
const commentController = require('./comments.controller')

comments.get('/posts/:id/comments', commentController.getByPost)
comments.get('/posts/:id/comments/:commentId', commentController.getOne)
comments.post('/posts/:id/comments', commentController.create)
comments.put('/posts/:id/comments/:commentId', commentController.update)
comments.delete('/posts/:id/comments/:commentId', commentController.remove)

module.exports = comments
