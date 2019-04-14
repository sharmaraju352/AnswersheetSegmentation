const fs = require('fs-extra');
const util = require('util');
const readdir = util.promisify(fs.readdir);

getThumbnailQuestion = seat_number => {
  return new Promise(resolve => {
    readdir('output2')
      .then(files => {
        for (var i = 0; i < files.length; i++) {
          const file = files[i];
          const roll_number = file.split('_')[0];
          const question = file
            .split('_')[1]
            .split('.')[0]
            .charAt(1);
          if (seat_number == roll_number) {
            resolve(question);
          }
        }
      })
      .catch(error => {
        console.log(eror);
      });
  });
};

function asyncCall() {
  console.log('calling');
  var result = getThumbnailQuestion('S0124').then(res => console.log(res));
  // expected output: 'resolved'
}

asyncCall();
