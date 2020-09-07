const express = require('express')
const bcrypt = require("bcryptjs")
const router = express.Router()
const {ensureAuthenticated} = require("../config/auth")

const Room = require("../models/Room") //call room model
const User = require("../models/User") //call user model


// welcome page
router.get('/',  (req, res) => res.render('welcome'))

router.get('/123',  (req, res) => res.send('welcome'))



//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name: req.user.name
}))


let sessions = {}

//test Create Room
// router.post("/index/create/:roomid", (req, res) => {
//   console.log(req.body)
//   console.log(req.params.roomid + "starts streaming")
//   sessions[req.params.roomid] = req.body
// })

// Create Room
router.get("/index/create", (res) => {
  res.json({"123":123});
  
})

// Create Room
router.post("/index/create/:roomid", (req, res) => {
  //將password改為輸入的password
  User.updateOne({email: req.body.email}, {roompwd: req.body.password}, function(err){
    if(err) console.log(err)
    console.log("room's pwd is successfully updated and starts streaming!")
  })
  //將nowroom改為自己的房間
  User.updateOne({email: req.body.email}, {nowroom: req.body.roomid}, function(err){
    if(err) console.log(err)
  }) 
  console.log(req.body.data)
  sessions[req.params.roomid] = req.body
  res.json({"success": true, "msg": "Your room "+req.body.roomid+" is opened successfully!"})
})

// test join room
// router.get("/index/join/:roomid", (req, res) => {
// res.json({"data": sessions[req.params.roomid]})
// })

// Join Room
router.post("/index/join/:roomid", (req, res) => {
  User.findOne({roomid: req.body.roomid})
    .then(user => {
      if(!user){
        res.json({"success": false, "msg": "wrong roomid"})
      }
      // Match password
      if(user.roompwd == req.body.password){
        User.updateOne({name: req.body.email}, {nowroom: req.body.roomid}, function(err){
          if(err) console.log(err)
        })
        res.json({"success": true, 
                  "msg": "you are now in room " + req.params.roomid,
                  "data": sessions[req.params.roomid]
                })       
      }
      else{
        res.json({"success": false, "msg": "wrong password"})
      }
    })
    .catch(err => console.log(err))
  
})

module.exports = router