const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Note = new Schema({
    userid:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productid:{
        type: Schema.Types.ObjectId,
        ref:'Product'
    },
    bookid:{
        type: Schema.Types.ObjectId,
        ref:'Book'
    },
    courseid:{
        type: Schema.Types.ObjectId,
        ref:'Course'
    },
    note:{
        type: Number
    }
});

module.exports = mongoose.model('Note', Note);