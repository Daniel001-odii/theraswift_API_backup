import { Document, Types, ObjectId } from "mongoose";

export interface IAdminReg extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  gender: string;
  dateOFBirth: string;
  practiseCode: string;
  topAdmin: string;
  createdAt: Date;
  updatedAt: Date;
  passwordOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  phoneNumberOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
}