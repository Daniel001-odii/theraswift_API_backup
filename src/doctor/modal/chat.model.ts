import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const ChatSchema = new Schema(
    {
      user: {
        type: String,
      },
      text: {
        type: String,
      },
      room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorChatRoom',
      },
    },
    {
      timestamps: true,
    }
  );

  const ChatModel  = mongoose.model('patientsChats', ChatSchema);
  export default ChatModel;