import { Document, Types, ObjectId } from "mongoose";

export interface IEssentailCategory extends Document {
  _id: ObjectId;
  name: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
}