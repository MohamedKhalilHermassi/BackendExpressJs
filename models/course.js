const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { courseType, level } = require('../shared/enums');
const session = require('./session');

const Course = new Schema({
    name:{
        type : String,
        required : true,
    },
    description: {
        type: String,
    },
    hourly_based_price: {
        type: Number,
        required: true,
    },
    courseType: {
        type : String,
        required : true,
        enum : Object.values(courseType),
    },
    level : {
        type : String,
        required: true,
        enum : Object.values(level)
    },
    image:{
        type : String,
    },
    students:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    teacher:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sessions : [{
        type: Schema.Types.ObjectId,
        ref: 'Session'
    }],
    exams : [{
        type: Schema.Types.ObjectId,
        ref: 'Exam'
    }]

});

module.exports = mongoose.model('Course', Course);