const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")  //到資料庫查資料登入
const bcrypt = require("bcryptjs") //解密密碼驗證

// Load User Model
const User = require("../models/User")

module.exports = function(intoroompass) {
    passport.use(
        new LocalStrategy({ usernameField: "roomid"}, (roomid, roompwd, done) =>{
            //Match User
            User.findOne({roomid: roomid})
                .then(user => {
                    if(!user){
                        return done(null, false, {message: "that room is not exist"})
                    }

                    // Match password
                    bcrypt.compare(roompwd, user.roompwd, (err, isMatch) =>{
                        if(err) throw err

                        if(isMatch) {
                            return done(null, user) //對應上面return done厚面是false，這次match到了市return user
                        } else {
                            return done(null, false, { message: "that roompwd is incorrect" })
                        }
                    })//user.roompwd是hashed
                })
                .catch(err => console.log(err))
            
        })
    
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
      })

}