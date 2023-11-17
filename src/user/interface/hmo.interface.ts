import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";

export interface IHmo extends Document {
  _id: ObjectId;
  userId: IUserReg['_id'];
  hmoImage: string;
  enrolNumber: string;
  enrolName: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}