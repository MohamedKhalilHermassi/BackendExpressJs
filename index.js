//require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./database/dbConfig.json');
const { createAdminUserIfNotExists } = require('./routes/DataInitializer');
const app = express();
app.use(cors(config.cors.options));


mongoose.connect(config.mongo.uri)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {console.log('Connected to Database')
createAdminUserIfNotExists()});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())

const usersRouter = require('./routes/userroutes')
app.use('/users', usersRouter)

app.listen(3000, () => console.log('Server Started'))