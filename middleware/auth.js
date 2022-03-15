const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리 하는 곳
    //1. 클라이언트 쿠키에서 토큰을 가져오기
    let token = req.cookies.x_auth;

    //2. 토큰을 복호화 한 후 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})
        req.token = token;
        req.user = user;
        next(); //middleware에 갖히지 않고 갈 수 있게 넣어준다
    })
    //3. 유저가 있으면 인증 완료
    //4. 유저가 없으면 인증 불가
}

module.exports = { auth };