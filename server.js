require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { createAdminUserIfNotExists } = require('./routes/DataInitializer');
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {console.log('Connected to Database')
createAdminUserIfNotExists()})

app.use(express.json())

const usersRouter = require('./routes/userroutes')
app.use('/users', usersRouter)

app.listen(3000, () => console.log('Server Started'))