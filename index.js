const express = require('express');
const multer = require('multer');
const logger = require('morgan');
const createEroor = require('http-errors');
const mongoose = require('mongoose');
const config = require('./database/dbConfig.json');
const cors = require('cors');
const path = require('path');

const { createAdminUserIfNotExists } = require('./routes/DataInitializer');

const app = express();

app.use(cors(config.cors.options));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: '/uploads/' + req.file.filename });
});


const PORT = process.env.PORT || 3000;


mongoose.connect(config.mongo.uri)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {console.log('Connected to Database')
createAdminUserIfNotExists()});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
const usersRouter = require('./routes/userroutes')
const eventRouter = require('./routes/eventRoute');
app.use('/users', usersRouter);

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

app.use(express.json())


//gestion evenements
app.use('/events', eventRouter);
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
