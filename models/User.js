
// 몽고디비에서 사용할 모델과 그 모델의 스키마(속성) 등 정의 한다.
const mongoose = require('mongoose');
// 암호화를 위한 패키지를 불러온다
const bcrypt =require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');


// 모델의 Schema 지정
const userSchema = mongoose.Schema({
    name:{
        type : String,
        maxlength:50

    },
    password:{
        type:String,
        maxlength:500
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    role:{
        type:Number,
        defalut:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

// 세이브가 되기전 실행할 함수

userSchema.pre('save',function(next){
var user = this;



if(user.isModified('password')){


// 비밀번호를 암호화 시킨다. 
bcrypt.genSalt(saltRounds, function(err, salt){
   if(err) return next(err)

   bcrypt.hash( user.password , salt, function(err , hash){
       if(err) return next(err)
       user.password = hash
       next()
    });
 });
}else{
    next();
   }
});


userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}


userSchema.methods.generateToken = function(cb){

    var user = this;

    // jsonwebToken 을 사용해서 토큰생성

      var token = jwt.sign(user._id.toHexString(), 'secretToekn')

        // user._id _ 'secretToekn' = token

    user.token = token

    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null , user);
    })

    }

// 모델을 생성하면서 위에서 먼저 생성한 스키마를 적용 시킨다.
const User = mongoose.model('User',userSchema);

// 다른 곳 에서도 모델을 사용 할 수 있도록 export 한다.
module.exports = {User}