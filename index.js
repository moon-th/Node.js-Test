const express = require("express");
const app = express();
const port = 3000
const bodyParser = require('body-parser');

const config = require('./config/key');

const {User} = require('./models/User');

//application/x -www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());

//몽고디비 와 연결하기 위한 패키지
const mongoose = require('mongoose')
//몽고디비 와 커넥션 하기위한 Cluster URL
mongoose.connect(config.mongoURI,{
    useNewParser: true , useUnifredTopology:true,useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected..')).catch(err => console.log(err))

app.get('/', (req , res) => res.send('Hello World! 태환!!'))

app.post('/register', (req,res) =>{
// 회원 가입 할때 필요한 정보들을 client에서 가져오면
// 그것들을 데이터베이스에 넣어준다.



    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
});



app.listen(port, () => console.log('Express app listening on port'+{port}+'!'))


