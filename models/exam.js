const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Exam = new Schema({
    name: {
        type: String,
        required: true
    },
    date:{
        type: Date
    },
    grade:{
        type: Number,
        required: true
    },
    course : {
        type: Schema.Types.ObjectId,
        ref : 'Course'
    }
});

module.exports = mongoose.model('Exam', Exam);