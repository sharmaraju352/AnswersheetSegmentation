// const filename = 'til32.jpg';
// const id = '5c29d9929d3ced2c3996e802';
// const f = filename.split('.');
// const newFileName = id + '.' + f[1];
// console.log(`new Filename: ${newFileName}`);

const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../../config/config');
var id = mongoose.Types.ObjectId();

mongoose
  .connect(
    config.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => insertAdminUser())
  .catch(err => console.log(err));

insertAdminUser = () => {
  const newUser = new User({
    _id: id,
    name: 'Admin',
    email: 'admin@segmentation.com',
    password: '123456',
    roles: ['admin'],
    enabled: true,
    deleted: false
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err;
      }
      newUser.password = hash;
      newUser
        .save()
        .then(user => console.log('Admin account created successfully'))
        .catch(err => console.log(err));
    });
  });
};
