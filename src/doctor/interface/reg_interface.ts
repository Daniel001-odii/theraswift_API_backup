import { ID } from "aws-sdk/clients/s3";
import { Document, Types, ObjectId } from "mongoose";

export interface IDoctorReg extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  title: string;
  organization: string;
  clinicCode: string,
  createdAt: Date;
  updatedAt: Date;
  // verified: boolean; 
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  passwordToken: number;
  passwordChangeStatus: boolean;
}


export interface IPatientReg extends Document {
  _id: ObjectId;
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: number;
  gender: string;
  dateOFBirth: string;
  address: string;
  medicalRecord: string;
  hmo: string;
  doctorId: IDoctorReg['_id'];
  createdAt: Date;
  updatedAt: Date;
}