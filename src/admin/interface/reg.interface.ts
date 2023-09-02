import { Document, Types, ObjectId } from "mongoose";

export interface IAdminReg extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  passwordOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
}