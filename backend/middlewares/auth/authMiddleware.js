const jwt = require('jsonwebtoken')
const UserSchema = require('../../modules/users/users.schema')

const publicRoutes = [
    { method: 'POST', path: '/login' },
    { method: 'POST', path: '/users' },
]

const isPublic = (req) => {
    if (req.path.startsWith('/auth/google')) {
        return true
    }
    return publicRoutes.some((route) => route.method === req.method && route.path === req.path)
}

const authMiddleware = async (req, res, next) => {
    if (isPublic(req)) {
        return next()
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ statusCode: 401, message: 'Token not provided' })
    }

    try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserSchema.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(401).send({ statusCode: 401, message: 'Invalid token' })
        }

        req.user = user
        next()
    } catch (e) {
        return res.status(401).send({ statusCode: 401, message: 'Invalid or expired token' })
    }
}

module.exports = authMiddleware
