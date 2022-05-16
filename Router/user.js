const express = require('express');
const router = express.Router();

// ANCHOR Models를 불러오기
const { User } = require('../Models/User');

router.post('/register', (req, res) => {
  // 인스턴스 생성 : 할당된 실체
  const user = new User(req.body); // body-parser을 통해 json 형태를 가져올 수 있다.

  user
    .save()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
  // TODO 같은 내용???
  // user.save((err, userInfo) => {
  //   if (err) return res.json({ success: false, err });
  //   return res.status(200).json({ success: true });
  // });
});

router.post('/login', (req, res) => {
  // 1. 요청된 이메일을 데이터베이스에서 있는지 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당되는 유저가 없습니다.',
      });
    }
    // 2. DB에서 요청한 이메일이 있는 경우, 비밀번호가 맞는 비밀번호인지 확인하기
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch)
        return res.status(400).json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });

      // 3. 비밀번호까지 같다면 토큰을 생성하기
      user.generateToken((err, user) => {
        console.log('g', err);
        if (err) return res.status(400).send(err);

        // 토큰을 쿠키 저장한다. 쿠키, 로컬스토리지, 세션등 다양학 존재하며 각각의 장단점이 있다.
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});
module.exports = router;
