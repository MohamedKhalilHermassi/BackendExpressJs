const mongoose = require('mongoose')
const { createAdminUserIfNotExists } = require('./routes/DataInitializer')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("Connect to MongoDB successfully")
        const db = mongoose.connection
        db.on('error', (error) => console.error(error))
        db.once('open', () => {console.log('Connected to Database')
        createAdminUserIfNotExists()
});
    } catch (error) {
        console.log("Connect failed " + error.message )
    }
}

module.exports = connectDB
