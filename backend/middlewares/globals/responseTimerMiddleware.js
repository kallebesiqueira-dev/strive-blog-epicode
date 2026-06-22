const responseTimerMiddleware = (req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const end = Date.now()
        const responseTime = end - start

        console.log(`${req.method} ${req.originalUrl} - ${responseTime} milliseconds`)
    })

    next()
}

module.exports = responseTimerMiddleware