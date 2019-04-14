const util = require('util');
const fs = require('fs-extra');
const readdir = util.promisify(fs.readdir);

let questions = {};
readdir('../output2')
  .then(files => {
    files.forEach(file => {
      const roll_number = file.split('_')[0];
      const question = file
        .split('_')[1]
        .split('.')[0]
        .charAt(1);
      if (questions[question] !== undefined) {
        if (questions[question].indexOf(roll_number) === -1) {
          questions[question].push(roll_number);
        }
      } else {
        questions[question] = [roll_number];
      }
    });
    console.log(questions);
  })
  .catch(error => {
    console.log(error);
  });
