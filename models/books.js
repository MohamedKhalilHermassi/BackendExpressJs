const mongoose = require('mongoose');
const { productCondition, productType } = require('../shared/enums');

const Schema = mongoose.Schema;

const Book = new Schema({
  bookName: {
    type: String,
    required: true
  },
  bookDescription: {
    type: String,
    required: true
  },
  bookPrice: {
    type: Number,
    required: true
  },
 
  Author: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  filename: {
    type: String,
    required: false
  },
  contentType: {
    type: String,
    required: false
  },
  archived: {
    type: Boolean,
    required: true,
  },

});

module.exports = mongoose.model('Book', Book);
