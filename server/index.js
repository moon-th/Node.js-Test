const express = require("express");
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');


const {User} = require('./models/User');
const {auth} = require('./middleware/auth');

const cors = require("cors");

let cors_origin = [`http://localhost:3000`];

app.use(

    cors({

        origin: cors_origin, // 허락하고자 하는 요청 주소

        credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.

    })

);

//application/x -www-form-urlencoded
//app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());

app.use(cookieParser());

//몽고디비 와 연결하기 위한 패키지
const mongoose = require('mongoose')
//몽고디비 와 커넥션 하기위한 Cluster URL
mongoose.connect(config.mongoURI,{
   useCreateIndex: true,useUnifiedTopology: true,useFindAndModify: false, useNewUrlParser: true
}).then(() => console.log('MongoDB connected..')).catch(err => console.log(err))

app.get('/', (req , res) => res.send('Hello World! 태환!!'))

app.get('/api/hello' , (req, res) => {
    res.send('안녕하세요 ~ ')
})


app.get('/register', (req,res) => {
// 회원 가입 할때 필요한 정보들을 client에서 가져오면
// 그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body)
  

    user.save((err, user) => {
        console.log(user.name)
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
});

app.post('/login', (req, res)=>{

 //요청된 이메일을 데이터베이스에서 있는지 찾는다. 
 User.findOne({ email:req.body.email },(err, user) =>{
     if(!user){
         return res.json({
             loginSuccess:false,
             message:"제공된 이메일에 해당하는 유저가 없습니다."
         })
     }
 //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.

     user.comparePassword(req.body.password, (err , isMatch) => {
        if(!isMatch)
            return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
        
       //비밀번호 까지 맞다면 토큰을 생성하기
       
       user.generateToken((err , user) => {
            if(err) return res.status(400).send(err);

            // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                   res.cookie("X_auth",user.token )  
                    .status(200)
                    .json({loginSuccess:true, userId:user._id.toHexString()})
       });
     })
 })



 //비밀번호 까지 맞다면 토큰을 생성하기. 
});
//권한관련                //미들웨어
app.get('/api/users/auth', auth ,(req,res) => {

 //여기까지 미들웨어를 통과해 왔다는 애기는 Authentication 이 true 라는 말.
 res.status(200).json({
    _id:req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth:true,
    email : req.user.email,
    name:req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image:req.user.image
 })
});

app.get('/api/users/logout' , auth, (req,res) =>{
    User.findOneAndUpdate({_id:req.user._id},
        {toeken:""},
        (err , user) =>{
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                success:true
            })
        })
})



const port = 5000;

app.listen(port, () => console.log('Express app listening on port'+{port}+'!'))

