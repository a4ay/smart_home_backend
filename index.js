const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const DB = ``

const activeUsers = {}

const db = require('./DB/database')
const auth = require('./utils/auth')

app.use(cors())


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.post('/login',auth.isAuthenticated,(req,res)=>{
  res.status(200).send({
    message : "success!",
    success : true
  })
})

app.get('/get-user-data',auth.isAuthenticated,async (req,res)=>{

  const user = await db.findUser(req.headers.userid) //ALL DB oprations
  res.status(200).send(user)
})

app.post('/switch',auth.isAuthenticated,(req,res)=>{
  const userid = req.headers.userid
  const pin = req.body.pin
  const state = req.body.state

  if(!pin || state === 'undefined') return res.send({
    success : false,
    message : 'invalid args'
  })
  if( !activeUsers[userid]){
    return res.status(404).send({
      success : false,
      message : 'home pi server not connected',
    })
    
    }
  db.updateUserSwitch(userid,pin,state)
  activeUsers[userid].emit('switch',{
    pin : pin,
    state : state
  })
  res.status(200).send({
    success : true
  })

})

app.get('/',(req,res)=>{
  res.status(200).send({message : 'Welcome to iot api services!'})
})

io.on('connection',(socket)=>{
  const userid = socket.handshake.headers.userid

  if( db.findUser(userid)){

    activeUsers[userid] = socket

    // listen for changes of sensor data

    socket.on('disconnect',()=>{
      delete activeUsers[userid]
    })

  }else{
    socket.disconnect({message : 'authentication failed'})
  }

})

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{

  server.listen(4000,()=>{
  console.log('listening at port 4000')
  })

})


