const express = require('express')
const router = express.Router()



const User = require("../models/User") //call user model


let sessions = {}


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