const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [
      {
        type: String,
        enum: ['teacher', 'admin']
      }
    ],
    default: ['teacher']
  },
  avatar: {
    type: String
  },
  enabled: Boolean,
  deleted: Boolean,
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

module.exports = User = mongoose.model('users', UserSchema);
