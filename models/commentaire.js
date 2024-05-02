const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    required: true,
  },
  date_c: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
});

const CommentaireSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    required: true,
  },
  date_c: {
    type: Date,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  score: {
    type: Number,
    default: 0,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  replies: [ReplySchema], // Define the replies field as an array of ReplySchema
});

module.exports = mongoose.model('Commentaire', CommentaireSchema);
