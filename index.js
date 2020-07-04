const express = require("express")
const app = express()
const port = 3000
//몽고디비 와 연결하기 위한 패키지
const mongoose = require('mongoose')
//몽고디비 와 커넥션 하기위한 Cluster URL
mongoose.connect('mongodb+srv://moon:aa271488@cluster0-ottnu.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewParser: true , useUnifredTopology:true,useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected..')).catch(err => console.log(err))

app.get('/', (req , res) => res.send('Hello World!'))

app.listen(port, () => console.log('Express app listening on port'+{port}+'!'))

