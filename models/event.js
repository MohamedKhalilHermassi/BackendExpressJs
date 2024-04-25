const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Status} = require('../shared/enums');
const {Category} = require('../shared/enums');

const Event = new Schema({
    title:{
        type : String,
        required : true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    location: {
        type : String,
        required : true,
    },
    capacity : {
        type : Number,
        required: true,
    },
    ticketPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(Category)
    },
    status :{
        type: String,
        required: true,
        enum : Object.values(Status)
    },
    image: {
        type: String,
        required: false,
    },
    ratings: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          rating: {
            type: Number,
            min: 1,
            max: 5,
          },
        },
      ],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Event', Event);