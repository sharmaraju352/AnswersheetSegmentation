const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const fs = require('fs-extra');
const util = require('util');
const path = require('path');
const EvaluationResult = require('../../model/evaluation_result');
const exec = util.promisify(require('child_process').exec);
const readdir = util.promisify(fs.readdir);
const router = express.Router();

router.post(
  '/upload',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var fstream;
    req.pipe(req.busboy);

    let file_name;
    req.busboy.on('field', function(
      fieldname,
      val,
      fieldnameTruncated,
      valTruncated,
      encoding,
      mimetype
    ) {
      seat_number = util.inspect(val);
      seat_number = replaceAll(seat_number, "'", '');
      file_name = seat_number + '.pdf';
    });

    req.busboy.on('file', function(fieldname, file, filename) {
      fstream = fs.createWriteStream('uploaded_files/' + file_name);
      file.pipe(fstream);
      fstream.on('close', function() {
        executePythonCode(file_name).then(result => {
          readdir('output2')
            .then(files => {
              let questions = [];
              files.forEach(file => {
                const index1 = file.lastIndexOf('Q');
                const index2 = file.lastIndexOf('.');
                const question = parseInt(file.substring(index1 + 1, index2));
                if (!questions.includes(question)) {
                  questions.push(question);
                }
              });
              questions.sort(function(a, b) {
                return a - b;
              });
              console.log(questions);
              res.json({ questions });
            })
            .catch(error => {
              console.log(error);
            });
        });
      });
    });
  }
);

router.get('/getAnswersheets', (req, res) => {
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
      res.json({ questions });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/getQuestionMarksMap', (req, res) => {
  const questionMarksMap = {
    1: 5,
    2: 10,
    3: 7,
    4: 2,
    5: 15,
    6: 12,
    7: 8,
    8: 5,
    9: 10,
    10: 15
  };
  res.json({ questionMarksMap });
});

router.post(
  '/evaluate/:selectedQuestion/:selectedSeatNumber/:givenMarks',
  (req, res) => {
    console.log('selectedQuestion: ', req.params.selectedQuestion);
    console.log('selectedSeatNumber: ', req.params.selectedSeatNumber);
    console.log('givenMarks: ', req.params.givenMarks);
    const evaluationResult = new EvaluationResult({
      seat_number: req.params.selectedSeatNumber,
      question_number: req.params.selectedQuestion,
      marks: req.params.givenMarks
    });
    evaluationResult.save().then(result => res.json(result));
  }
);

router.get('/:seat_number/answer/:question/:occurance', (req, res) => {
  const fileName =
    req.params.seat_number +
    '_Q' +
    req.params.question +
    '_' +
    req.params.occurance +
    '.jpg';

  console.log('fileName: ', fileName);
  res.sendFile(path.join(__dirname, '..', '..', 'output2', fileName));
});

router.get('/getEvaluationResults', (req, res) => {
  let evaluationResult = {};
  let marks = 0;
  EvaluationResult.find({}, (err, results) => {
    if (!err) {
      results.forEach(result => {
        marks = marks + result.marks;
        evaluationResult[result.seat_number] = {};
        getThumbnailQuestion(result.seat_number)
          .then(thumbnailQuestion => {
            evaluationResult[result.seat_number].marks = marks;
            evaluationResult[
              result.seat_number
            ].thumbnailQuestion = thumbnailQuestion;
            res.json({ results: evaluationResult });
          })
          .catch(err => console.log(err));
      });
    } else {
      throw err;
    }
  });
});

router.get('/getDetailedEvaluationResults/:seat_number', (req, res) => {
  const seat_number = req.params.seat_number;
  const detailedResult = {};
  EvaluationResult.find({}, (err, results) => {
    if (!err) {
      results.forEach(result => {
        if (result.seat_number === seat_number) {
          detailedResult[result.question_number] = result.marks;
        }
      });
    }
    res.json({ detailedResult });
  });
});

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
executePythonCode = async seat_number => {
  const { stdout, stderr } = await exec(
    `python template_matching6.py ${seat_number}`
  );
};

replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
};
module.exports = router;
