const util = require('util');
const exec = util.promisify(require('child_process').exec);
executePythonCode = async seat_number => {
  const { stdout, stderr } = await exec(
    `cd python`,
    `python template_matching6.py ${seat_number}`
  );
  console.log('stdout: ', stdout);
  console.log('stderr: ', stderr);
};

executePythonCode('S0124.pdf');
