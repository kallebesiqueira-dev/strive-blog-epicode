const express = require('express')
const cors = require('cors')
const path = require('path')
const initServer = require('./config/db')
const PORT = 9099

// middleware imports
const logger = require('./middlewares/globals/logger')
const errorHandlerMiddleware = require('./middlewares/errors/errorHandler')
const responseTimeMiddleware = require('./middlewares/globals/responseTimerMiddleware')

// routes
const usersRoute = require('./modules/users/users.route')
const postsRoute = require('./modules/posts/posts.route')

const server = express()
server.use(express.json())
server.use(cors())
server.use('/upload', express.static(path.join(__dirname, './upload')))
server.use(logger)
server.use(responseTimeMiddleware)

server.use('/', usersRoute)
server.use('/', postsRoute)

// alla fine di tutte le route ci va l'error handler
server.use(errorHandlerMiddleware)

initServer(PORT, server)

