const express = require('express');
const logger = require('morgan');
const createEroor = require('http-errors');
const mongoose = require('mongoose');
const config = require('./database/dbConfig.json');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const courseRouter = require('./routes/courseRoute');
const classroomRouter = require('./routes/classroomRoute');
const examRouter = require('./routes/examRoute');
const sessionRouter = require('./routes/sessionRoute');
const productRouter = require('./routes/productRoute')

app.use(cors());

app.use(express.json())
//gestion cours
app.use('/courses', courseRouter);
app.use('/classrooms', classroomRouter);
app.use('/exams', examRouter);
app.use('/sessions', sessionRouter);

//gestion magasin
app.use('/market',productRouter)
app.use('/uploads', express.static('uploads'));

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
