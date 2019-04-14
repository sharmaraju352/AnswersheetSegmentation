const mongoose = require('mongoose');
const Marks = require('./model/mark');
const config = require('./config/config');

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => insertMarks())
  .catch(err => console.log(err));

const newMarks = new Marks({
  question_number: 10,
  marks: 15
});

insertMarks = () => {
  newMarks
    .save()
    .then(marks => console.log(marks))
    .catch(err => console.log('error: ', err));
};
