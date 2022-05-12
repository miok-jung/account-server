const express = require('express');
const router = express.Router();

// ANCHOR Models를 불러오기
const { User } = require('../Models/User');

router.post('/register', (req, res) => {
  // 인스턴스 생성 : 할당된 실체
  const user = new User(req.body); // body-parser을 통해 json 형태를 가져올 수 있다.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
