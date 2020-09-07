const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")  //到資料庫查資料登入
const bcrypt = require("bcryptjs") //解密密碼驗證
var multer  = require('multer')
var upload = multer()
// Load User Model
const User = require("../models/User")

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email", passwordField: 'password'}, (email, password, done) =>{
            //Match User
            User.findOne({email: email})
                .then(user => {
                    if(!user){
                        console.log("the user dosen't exist")
                    }

                    // Match password
                        if(user.password == password) {
                            
                            console.log("success")
                            User.updateOne({name: user.name}, {success: true}, function(err){
                                if(err) console.log(err)
                                console.log(user.name + " is now online")
                            }) 
                            return done(null, user)

                        } else {
                            console.log("that password is incorrect")
                        }
                    //user.password市hashed
                })
                .catch(err => console.log(err))
        })
    )
    // only the user ID is serialized to the session, keeping the amount of data stored within the session small. 
    // When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
    passport.serializeUser((user, done) => { 
        done(null, user.id)
      })
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
      })

}

// 序列化（serialize）簡單來說就是把「物件」轉換成可被儲存在儲存空間的「資料」的這個過程，例如把 JavaScript 中的物件透過 JSON.stringify() 變成字串，就可以存放在儲存空間內；
// 而反序列化則反過來是把「資料」轉換成程式碼中的「物件」，例如把 JSON 字串透過 JSON.parse() 轉換成物件。