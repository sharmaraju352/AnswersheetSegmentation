const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarkSchema = new Schema({
  question_number: {
    type: Number,
    required: true
  },
  marks: {
    type: Number,
    required: true
  }
});

module.exports = User = mongoose.model('marks', MarkSchema);
