const mongoose = require('mongoose');
const { productCondition, productType } = require('../shared/enums');

const Schema = mongoose.Schema;

const Product = new Schema({
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productCondition: {
    type: String,
    required: true,
    enum: Object.values(productCondition),
  },
  productAvailability: {
    type: Boolean,
    required: true,
  },
  productType: {
    type: String,
    required: true,
    enum: Object.values(productType),
  },
  sold: {
    type: Boolean,
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
  // Many to one with user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Product', Product);
