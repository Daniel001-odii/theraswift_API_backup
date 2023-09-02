import { Document, Types, ObjectId } from "mongoose";

export interface IUserReg extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  dateOfBirth: string;
  lastName: string;
  mobileNumber: number;
  gender: string;
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