import { Document, Types, ObjectId } from "mongoose";

export interface INewaletter extends Document {
  _id: ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}