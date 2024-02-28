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
        required: true,
    },
    price: {
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