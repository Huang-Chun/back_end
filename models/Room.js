const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  
  UserID: {
    type: String,
    required: true
  },

  roomid: {
    type: String,
    required: true
  }
  
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;