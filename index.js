
const express = require('express');
const multer = require('multer');
const logger = require('morgan');
const createEroor = require('http-errors');
const mongoose = require('mongoose');
const config = require('./database/dbConfig.json');
const cors = require('cors');
const path = require('path');
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


mongoose.connect(config.mongo.uri)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())

const eventRouter = require('./routes/eventRoute');

app.use('/events', eventRouter);
app.listen(3000, () => console.log('Server Started'))

