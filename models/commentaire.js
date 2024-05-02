const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Commentaire = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User' ,
    },
   

    description: {
        type: String,
        required: true,
    },
    date_c : {
        type : Date,
        required: true ,
    },
    course : {
        type: Schema.Types.ObjectId,
        ref : 'Course'
    },
    score: {
        type: Number,
        default: 0, // Default value of 0 for the score attribute
    }
   

});

module.exports = mongoose.model('Commentaire', Commentaire);