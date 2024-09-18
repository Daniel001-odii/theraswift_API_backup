import { userMedicatonRequiredPrescriptionController } from "../controllers/medication.controller";

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "room name is required to create room"]
  },
  pharm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminReg',
    required: [true, "pharmacy Id is required is required to create room"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserReg',
    required: [true, "user Id is required is required to create room"]
  },
  unread_messages: {
    type: Number, 
    default: 0
  },
  
}, {timestamps: true});

const chatRoom = mongoose.model('chatRoom', roomSchema);

export default chatRoom