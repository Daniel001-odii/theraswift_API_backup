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
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },

    },
    {
      timestamps: true,
    }
  );
  
  const ChatModel = model<IChat>("UserChat", ChatSchema);
  
  export default ChatModel;