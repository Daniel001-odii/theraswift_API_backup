import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  mobileNumber: string;
  gender: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
}
