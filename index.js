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




const PORT = process.env.PORT || 3000;





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
const usersRouter = require('./routes/userroutes');
const locationRouter = require('./routes/locationRouter');

app.use('/users', usersRouter)
const productRouter = require('./routes/productRoute')

app.use('/images', express.static('uploads/coursesImages'));
app.use(express.json());

const orderRouter = require('./routes/orderRoute')
app.use(cors());

app.use(express.json())
//gestion cours
app.use('/courses', courseRouter);
app.use('/classrooms', classroomRouter);
app.use('/exams', examRouter);
app.use('/sessions', sessionRouter);
app.use('/locations', locationRouter);

//gestion magasin
app.use('/market',productRouter)
app.use('/uploads', express.static('uploads'));
app.use('/orders', orderRouter);
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


mongoose.connect(config.mongo.uri,
  console.info('Database connected successfully')
  );

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
