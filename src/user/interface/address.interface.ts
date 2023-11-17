import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";

export interface IAddress extends Document {
  _id: ObjectId;
  userId: IUserReg['_id'];
  streetAddress: string;
  streetNO: string;
  LGA: string;
  DeliveryInstruction: string;
  createdAt: Date;
  updatedAt: Date;
}