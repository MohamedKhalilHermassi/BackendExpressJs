const mongoose = require('mongoose');
const reclamationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    files: [{ type: String }],
    typereclamtion:{type:String, enum:['techniques','administrative','Communication ','other']},
    otherreclamtion:{type:String},
    status: { type: String, enum: ['pending', 'resolved'],default: 'pending' } 
  });
  
  module.exports = mongoose.model('Reclamation', reclamationSchema);