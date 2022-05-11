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

// 특정 동작 이전에 실행으로 save를 하기 전에 호출이 된다.
// 도큐먼트 저장전 최종 검증으로 사용할 수도 있다.
// userSchema.pre('save', (next) => {
//   let user = this; //??
//   if(user.isModified('password')){}
// })

const User = mongoose.model('User', userSchema);

module.exports = { User };
