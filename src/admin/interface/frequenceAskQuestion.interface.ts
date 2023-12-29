import { Document, Types, ObjectId } from "mongoose";

export interface IFrequenceAsk extends Document {
  _id: ObjectId;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}