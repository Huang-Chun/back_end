const express = require('express')
const router = express.Router()

//Model
const User = require("../models/User") //call user model


//Login page
router.get('/login',  (req, res) => res.render('login'))

//Register page
router.get('/register',  (req, res) => res.render('register'))

//Register Handle
router.post("/register", (req, res) => {

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.password2
   
    if (password != password2) {
    res.json({"success":false, msg:"passwords are not the same"})
    }
      //validation passed 
    else{

      User.findOne({email: email}).then(user => {
        if (user) {
          res.json({"success": false, "msg":"user exist"})
        }
        else{
            const roomid = +new Date()
            const roompwd = 0
            const nowroom = 0
            const success = "false"
            const newUser = new User({
              name,
              email,
              password,
              roomid, 
              roompwd,
              nowroom,
              success
            })
            
            newUser.save()
              .then(user => {
                res.json({"success":true, "msg":"register successfuly"})
              })
              .catch(err => console.log(err))
        }      
      })
    }
})



// Login
router.post('/login', function(req, res) {
  const email = req.body.email
  console.log(email)
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        res.json({"success":false, 
                  "msg":"the email is not registered"
        })
      } 
      // Match password
      if(user.password == req.body.password) {
        User.updateOne({name: req.body.email}, {success: true}, function(err){
          if(err) console.log(err)
          res.json({"success": true, 
                    "msg": "login successfully", 
                    "name": user.name,
                    "email": user.email,
                    "roomid": user.roomid
          })
        }) 
      } 
      else {
        res.json({"success":false, "msg":"that password is incorrect"})
      }
    })
    .catch(err => console.log(err))
})

// Logout
router.post('/logout' , (req, res) => {
  User.updateOne({email: req.body.email}, {success: false}, function(err){
    if(err) console.log(err)
    console.log(req.body.email + " is now offline")
    res.json({"success":true, "msg":"logout successfully"})
  }) 
})

// 顯示某使用者資料
router.get('/userlist/:id', (req, res) => {
  User.findOne({_id:req.params.id}).lean().exec(function (err, users) {
    return res.send(JSON.stringify(users));
  })
})

//顯示所有使用者資料
router.get('/userlist', (req, res) => {
  User.find().lean().exec(function (err, users) {
    return res.send(JSON.stringify(users));
  })
})

//刪除使用者資料
router.get('/delete/:id', function (req, res, next) {
  const id = req.params.id
  console.log(req.params)
  console.log(id)
  User.deleteOne({ _id: id }, function (err) {
    if(err) console.log(err);
    res.send("delete"+ id )
  });
})

module.exports = router