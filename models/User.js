const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    
  },

  roomid:{
    type: String,
    requires: true
  },

  roompwd:{
    type: String,
    requires: true
  },

  nowroom:{
    type: String,
    requires: true
  },

  success:{
    type: String,
    requires: true
  },

  date: {
    type: Date,
    default: Date.now
  }
})
UserSchema.set("collection", "User")
const User = mongoose.model('User', UserSchema);

module.exports = User;
