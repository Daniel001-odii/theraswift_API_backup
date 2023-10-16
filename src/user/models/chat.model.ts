import { Schema, model } from "mongoose";
import { IChat } from "../interface/chat.interface";

const ChatSchema = new Schema(
    {
      sender: {
        type: String,
        required: true,
      },
      reciever: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
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