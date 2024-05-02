const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Location = new Schema({
    state:{
        type: String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    lat: {
        type: Number, 
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    numberOfFloors:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Location', Location);