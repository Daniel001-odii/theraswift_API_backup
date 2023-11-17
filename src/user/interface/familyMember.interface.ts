import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";

export interface IFamilyReg extends Document {
  _id: ObjectId;
  userId: IUserReg['_id'];
  firstName: string;
  dateOfBirth: string;
  lastName: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}