require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const initServer = require('./config/db')
const PORT = process.env.PORT || 9099

// middleware imports
const logger = require('./middlewares/globals/logger')
const errorHandlerMiddleware = require('./middlewares/errors/errorHandler')
const responseTimeMiddleware = require('./middlewares/globals/responseTimerMiddleware')
const authMiddleware = require('./middlewares/auth/authMiddleware')

// routes
const usersRoute = require('./modules/users/users.route')
const postsRoute = require('./modules/posts/posts.route')
const commentsRoute = require('./modules/comments/comments.route')
const authRoute = require('./modules/auth/auth.route')
const { passport } = require('./config/passport')

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean)

const server = express()
server.use(express.json())
server.use(cors({
    origin: allowedOrigins,
    credentials: true,
}))
server.use('/upload', express.static(path.join(__dirname, './upload')))
server.use(logger)
server.use(responseTimeMiddleware)
server.use(passport.initialize())
server.use(authMiddleware)

server.use('/', authRoute)
server.use('/', usersRoute)
server.use('/', postsRoute)
server.use('/', commentsRoute)

// alla fine di tutte le route ci va l'error handler
server.use(errorHandlerMiddleware)

initServer(PORT, server)

