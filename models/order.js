const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    date: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    validated : {
        type: Boolean,
        required: true,
        default : false
    },
    user : {
        type: Schema.Types.ObjectId,
        ref : 'User'
    },
    products : [{
        type: Schema.Types.ObjectId,
        ref : 'Product'
    }]
});

module.exports = mongoose.model('Order', Order);