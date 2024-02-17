const mongoose = require('mongoose')

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
  adress: {
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
    default:true
  },
})

module.exports = mongoose.model('user', userSchema)