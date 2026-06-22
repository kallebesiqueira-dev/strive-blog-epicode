const express = require('express')
const post = express.Router()
const postsController = require('./posts.controller')
const { upload } = require('../../middlewares/multer/index')
const { cloud } = require('../../middlewares/multer/index')


post.get('/posts', postsController.findAll)
post.get('/post/:id', postsController.findOne)

post.post('/posts', postsController.create)
post.post('/upload/post/image', upload.single('img'), postsController.uploadOnDisk)
post.post('/upload/post/cloud', cloud.single('img'), postsController.uploadFileOnCloud)

post.patch('/post/:id', postsController.update)

post.delete('/post/:id', postsController.deleteOne)


module.exports = post