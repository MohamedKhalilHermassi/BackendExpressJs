const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
    date: {
    type: Date,
    default: Date.now
  },
  mark: {
    type: Number,
    required: true
  },
  remark: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  

  
});

const Observation = mongoose.model('Observation', observationSchema);

module.exports = Observation;
