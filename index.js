const express = require('express');
const multer = require('multer');
const logger = require('morgan');
const createEroor = require('http-errors');
const mongoose = require('mongoose');
const config = require('./database/dbConfig.json');
const cors = require('cors');
const path = require('path');
const http = require('http');
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

const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {

  socket.on('message', (message) => {
    console.log('Message received:', message);
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
  });
});





mongoose.connect(config.mongo.uri)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {console.log('Connected to Database')
createAdminUserIfNotExists()
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
const courseRouter = require('./routes/courseRoute');
const classroomRouter = require('./routes/classroomRoute');
const examRouter = require('./routes/examRoute');
const sessionRouter = require('./routes/sessionRoute');
const usersRouter = require('./routes/userroutes');
const locationRouter = require('./routes/locationRouter');
const eventRouter = require('./routes/eventRoute');
const bookRouter = require('./routes/bookRoute')
const paymentRouter = require('./routes/payementRoute')
const messageRouter = require('./routes/messageRoute')
const transactionRouter = require('./routes/transactionRoute')

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
app.use('/payement',paymentRouter);
app.use('/api/messages', messageRouter); 
app.use('/transaction', transactionRouter); 


app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

//gestion evenements
app.use('/events', eventRouter);
app.use('/book',bookRouter);
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

const reclamationrouter = require('./routes/reclamationRoutes')
app.use('/Reclamtions', reclamationrouter(io))
mongoose.connect(config.mongo.uri,
  console.info('Database connected successfully')
  );
  
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };
