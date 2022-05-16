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

userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  // jsonwebtoken을 이용해서 token을 생성하기
  var user = this; // EX5문법

  // user._id = 모옥디비에서 ObjectId값이다.
  // user._id와 'secretToekn'를 결합하여 새로운 token을 생성

  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.toekn = token;
  user.save((err, user) => {
    console.log('je', err);
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
