import { Schema, model } from "mongoose";
import { IChat } from "../interface/chat.interface";
import mongoose from "mongoose";


const ChatSchema = new Schema(
    {
      user: {
        type: String,
      },
     /*  reciever: {
        type: String,
        
      }, */
      text: {
        type: String,
      },
      room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chatRoom',
      },
    },
    {
      timestamps: true,
    }
  );

  const ChatModel  = mongoose.model('patientsChats', ChatSchema);
  // const ChatModel = model<IChat>("AdminChat", ChatSchema);
  
  export default ChatModel;