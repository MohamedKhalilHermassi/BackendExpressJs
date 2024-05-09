const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'teacher', 'admin'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
    phone: {
      type: Number,
      required: true
    },
  birthday: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  //payement info start
  paid: {
    type: Boolean,
    required: true,
    default: true
  },
  lastPaymentDate: {
    type: Date,
    required: false,
  },
  expirePayementDate: {
    type: Date,
    required: false,
  },
  //payement info end
  image: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: null,
    required: false
  },
  notes: [
    {
      courseName: {
        type: String,
        required: true
      },
      mark: {
        type: Number,
        required: true
      }
    }
  ],
  favouriteInstrument: {
    type: [String], 
    default: []
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  recommendedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],

  availableTime: [{ startTime: String, endTime: String , day: String}],
  observations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }],

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
  events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  verificationCode: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
  
