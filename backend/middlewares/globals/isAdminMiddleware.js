const isAdminMiddleware = (req, res, next) => {
    const { role } = req.body


    if (role !== 'admin' || !role) {
        return res.status(401)
            .send({
                statusCode: 401,
                message: 'Not authorized'
            })
    }

    next()
}

module.exports = isAdminMiddleware