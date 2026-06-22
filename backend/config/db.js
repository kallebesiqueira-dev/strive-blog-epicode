const mongoose = require('mongoose')
const databaseConnectionString = 'mongodb+srv://markocolia:WsqfdP1u289PWjrg@cluster0.frdgjjv.mongodb.net/'


const initDatabaseConnection = async () => {
    try {
        await mongoose.connect(databaseConnectionString)
        console.log('Database connected successfully')
    } catch (error) {
        console.error('❌ Db connection error!')
        process.exit(1)
    }
}

const startServer = async (port, server) => {
    await initDatabaseConnection()
    server.listen(port, () => {
        console.log(`Server up and running on port ${port}`)
    })
}


module.exports = startServer
