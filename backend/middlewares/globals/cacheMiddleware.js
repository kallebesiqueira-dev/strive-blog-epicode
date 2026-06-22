const cache = new Map()
const TEN_MINUTES_IN_MS = 10 * 60 * 1000

const cacheMiddleware = (req,res, next) => {
    const { url } = req
    // estraiamo url dalla richiesta: es. http://localhost:9099/users

    const cachedResponse = cache.get(url)
    if (cachedResponse && Date.now() < cachedResponse.expiry) {
        console.log('Found data in cache, serving cached data.')
        return res.send(cachedResponse)
    }

    res.sendResponse = res.json
    res.json = (body) => {
        cache.set(url,  {
            body,
            expiry: Date.now() + TEN_MINUTES_IN_MS
        })
        res.sendResponse(body)
    }
    console.log('Fresh data saved in cache for future response with 10 minutes of expiry date')
    next()

}

module.exports = cacheMiddleware