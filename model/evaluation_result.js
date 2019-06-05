const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluationResultSchema = new Schema({
  seat_number: {
    type: String,
    required: true
  },
  question_number: {
    type: Number,
    required: true
  },
  occurance: {
    type: Number,
    required: true
  },
  marks: {
    type: Number,
    required: true
  }
});

module.exports = EvaluationResult = mongoose.model(
  'evaluation_results',
  EvaluationResultSchema
);
