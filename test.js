const fs = require('fs-extra');
const util = require('util');
const readdir = util.promisify(fs.readdir);

let questions = {};
readdir('output2')
  .then(files => {
    files.forEach(file => {
      const roll_number = file.split('_')[0];
      const question = file
        .split('_')[1]
        .split('.')[0]
        .charAt(1);
      const occurance = file.split('_')[2].split('.')[0];
      if (questions[roll_number] !== undefined) {
        if (questions[roll_number].indexOf(question) === -1) {
          questions[roll_number].push(question + '_' + occurance);
        }
      } else {
        questions[roll_number] = [question + '_' + occurance];
      }
    });
    transFormObject(questions);
  })
  .catch(error => {
    console.log(error);
  });

transFormObject = questions => {
  let thumbs = [];
  const selectedQuestion = '1';
  for (var key in questions) {
    if (questions.hasOwnProperty(key)) {
      for (var i = 0; i < questions[key].length; i++) {
        if (questions[key][i].split('_')[0] == selectedQuestion) {
          let thumb = {};
          thumb.seat_number = key;
          thumb.question = selectedQuestion;
          thumb.occurance = questions[key][i].split('_')[1];
          thumbs.push(thumb);
        }
      }
    }
  }
  console.log('thumbs: ', thumbs);
};
