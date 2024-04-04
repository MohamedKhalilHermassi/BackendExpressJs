const mongoose = require('mongoose');
const { classroomStatus, courseType } = require('../shared/enums');
const Schema = mongoose.Schema;

const Classroom = new Schema({
    number:{
        type:Number,
      
    },
    floor:{
        type:Number,
        required: true
    },
    location:{
        type: String,
         required: true 
    },
    status:{
        type:String,
        
        enum: Object.values(classroomStatus),
    },
    type:{
        type: String,
     
        enum: Object.values(courseType)
    },
    sessions : [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }]
});

module.exports = mongoose.model('Classroom', Classroom);
