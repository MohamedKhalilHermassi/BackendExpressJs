
const express = require('express');
const logger = require('morgan');
const createEroor = require('http-errors');
const mongoose = require('mongoose');
const config = require('./database/dbConfig.json');
const cors = require('cors');
const path = require('path');

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
const courseRouter = require('./routes/courseRoute');
const classroomRouter = require('./routes/classroomRoute');
const examRouter = require('./routes/examRoute');
const sessionRouter = require('./routes/sessionRoute');
const usersRouter = require('./routes/userroutes')
app.use('/users', usersRouter)
app.use('/courses', courseRouter);
app.use('/classrooms', classroomRouter);
app.use('/exams', examRouter);
app.use('/sessions', sessionRouter);
app.listen(3000, () => console.log('Server Started'))

