const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// ANCHOR Models를 불러오기
const { User } = require('../Models/User');

router.post('/register', (req, res) => {
  // 1. 회원 가입 할때 필요한 정보들을 client에서 가져온다.
  // 2. 해당 정보를 데이터 베이스에 넣어준다.

  // 인스턴스 생성 : 할당된 실체
  const user = new User(req.body); // body-parser을 통해 json 형태를 가져올 수 있다.

  // save : user Model 저장을 한다.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
