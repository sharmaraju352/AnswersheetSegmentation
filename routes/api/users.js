const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../../config/config');
const User = require('../../model/user');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users API works!!!');
});

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      var id = mongoose.Types.ObjectId();
      const avatar = config.baseUrl + `/api/avatar/${id}`;
      const newUser = new User({
        _id: id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        roles: [req.body.role],
        avatar,
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
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'user not found';
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatched => {
      if (isMatched) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.roles
        };

        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              msg: 'success',
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'wrong password';
        res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
