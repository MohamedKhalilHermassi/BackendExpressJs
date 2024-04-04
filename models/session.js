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
    classroom : {
        type: Schema.Types.ObjectId,
        ref : 'Classroom'
    } ,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Session', Session);