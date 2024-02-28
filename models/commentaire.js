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
    }
   

});

module.exports = mongoose.model('Commentaire', Commentaire);