
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "room name is required to create room"]
  },
  adminDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorReg',
    required: [true, "admin doctor Id is required is required to create room"]
  },
  practiceDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorReg',
    required: [true, "practice doctor Id is required is required to create room"]
  },
  unread_messages: {
    type: Number, 
    default: 0
  },
  
}, {timestamps: true});

const chatRoom = mongoose.model('DoctorChatRoom', roomSchema);

export default chatRoom