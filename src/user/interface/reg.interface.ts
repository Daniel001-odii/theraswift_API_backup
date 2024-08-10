import { Document, Types, ObjectId } from "mongoose";

export interface IUserReg extends Document {
  _id: ObjectId;
  userId: string;
  email: string;
  password: string;
  firstName: string;
  dateOfBirth: string;
  lastName: string;
  mobileNumber: number;
  gender: string;
  refererCode: string;
  refererCredit: number;
  reference: string;
  operatingLocation: string;
  address: string;
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
  isDeleted: Boolean;
}

export interface ICode extends Document {
  _id: ObjectId;
  code: number;
  createdAt: Date;
  updatedAt: Date;
}