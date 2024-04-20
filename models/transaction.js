const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userid: {
    type: String,
    required: true
  },
  cardNumber: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  
  timestamp: {
    type: Date,
    default: Date.now
  }
  
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
