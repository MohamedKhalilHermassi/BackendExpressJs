const mongoose = require('mongoose');
const reclamationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.email, ref: 'User' },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'resolved'],default: 'pending' } 
  });
  
  module.exports = mongoose.model('Reclamation', reclamationSchema);