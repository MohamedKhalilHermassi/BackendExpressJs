const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Classroom = new Schema({
    name:{
        type:String,
        required:true
    },
    etage:{
        type:Number,
        required: true
    },
    location:{
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    status:{
        type:String,
    },
    sessions : [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }]
});

module.exports = mongoose.model('Classroom', Classroom);