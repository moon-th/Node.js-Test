
// 몽고디비에서 사용할 모델과 그 모델의 스키마(속성) 등 정의 한다.
const mongoose = require('mongoose');

// 모델의 Schema 지정
const userSchema = mongoose.Schema({
    name:{
        type : String,
        maxlength:50

    },
    email:{
        type:String,
        trim:true,
        unique:1 
    },

    password:{
        type:String,
        maxlength:50
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
// 모델을 생성하면서 위에서 먼저 생성한 스키마를 적용 시킨다.
const User = mongoose.model('User',userSchema);

// 다른 곳 에서도 모델을 사용 할 수 있도록 export 한다.
module.exports = {User}