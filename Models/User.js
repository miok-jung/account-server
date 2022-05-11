const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
  {
    nickname: String,
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: String,
    role: {
      type: Number,
      default: 0,
    },
    token: String,
    tokenExp: Number,
  },
  { collection: 'users' },
);

userSchema.pre('save', (next) => {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
