const mongoose = require('mongoose');
const { classroomStatus, courseType } = require('../shared/enums');
const Schema = mongoose.Schema;

const Classroom = new Schema({
    number:{
        type:Number,
        required:true
    },
    floor:{
        type:Number,
        required: true
    },
    location:{
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    status:{
        type:String,
        required: true,
        enum: Object.values(classroomStatus),
    },
    type:{
        type: String,
        required: true,
        enum: Object.values(courseType)
    },
    sessions : [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }]
});

module.exports = mongoose.model('Classroom', Classroom);