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
  image: {
    type: String,
    required: true,
  },
  // relation one to many with products
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('User', userSchema);
