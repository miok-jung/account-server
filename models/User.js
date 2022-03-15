const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({ // 스키마 생성
    name: { // 필드 작성
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 스페이스를 없애주어 인식하는 기능
        unique: 1 // 같은 이메일을 사용하지 않게 유니크 하게 지정한다.
    },
    password: {
        type: String,
        minlength: 5
    },
    firstname: {
        type: String,
        maxlength: 50
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 관리자, 유저 관리
        type: Number, // 관리자와 유저 구별을 숫자로 한다.
        default: 0 // 임의로 role을 지정하지 않는 경우 기본값 0으로 지정한다.
    }, 
    image: String,
    token: {
        type: String,
    },
    tokenExp:{ // 토큰 유효기간
        type: Number
    }
})

userSchema.pre('save', function(next){
    let user = this;
    
    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
       
        })
    }else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword ex) 1234567 암호화된 비밀번호 ex)$2b$10$bLo59DerqCiwgFd... 가 같은지 체크
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    let user = this;
    //jsonwebtoken을 이용해서 token을 생성하기
    let token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })  
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;
    
    // 1. 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 2. 유저 아이디를 이용해서 유저를 찾은 뒤, 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


// 스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)

// 모델을 다른 파일에서도 쓸 수 있게 설정
module.exports = { User }