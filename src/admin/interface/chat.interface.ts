import { Document, Types, ObjectId } from "mongoose";

export interface IChat extends Document {
  _id: ObjectId;
  sender: string;
  reciever: string;
  message: string
  createdAt: Date;
  updatedAt: Date;
  
}