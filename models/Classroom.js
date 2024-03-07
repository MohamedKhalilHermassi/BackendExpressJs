const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Classroom = new Schema({
    location:{
        type: String,
        required: true
    },
    sessions : [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }]
});

module.exports = mongoose.model('Classroom', Classroom);