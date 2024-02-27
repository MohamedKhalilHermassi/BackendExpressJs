const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Session = new Schema({
    startDate: {
        type: Date,
        required: true,
    },
    duree: {
        type: Number,
        required: true,
    },
    course : {
        type: Schema.Types.ObjectId,
        ref : 'Course'
    },
    session : {
        type: Schema.Types.ObjectId,
        ref : 'Classroom'
    }
});

module.exports = mongoose.model('Session', Session);