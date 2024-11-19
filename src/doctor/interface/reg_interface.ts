import { ID } from "aws-sdk/clients/s3";
import { Document, Types, ObjectId } from "mongoose";

export interface IDoctorReg extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  title: string;
  organization: string;
  requestClinicCode: string,
  clinicCode: string,
  completedAccountSteps: {
    step1: {
      verifiedProfileDetails: boolean;
      addedProviders: boolean;
    },
    step2: {
      addedHmoInfo: boolean;
      addedPaymentMethod: boolean;
      addedVideoMeetingLocation: boolean;
      setupCalender: boolean;
    },
    step3: {
      addedPatients: boolean; 
    }
  }
  verifyClinicCode: boolean,
  superDoctor: boolean;
  addresss: string;
  speciality: string;
  regNumber: string;
  createdAt: Date;
  updatedAt: Date;
  // verified: boolean; 
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
  clinicVerification: {
    isVerified: Boolean;
    date: Date;
  },
  passwordToken: number;
  passwordChangeStatus: boolean;


  funds_payout: {
    account_number: string,
    bank_code: string,
  },

  followers: [{
    _id: {
      type: IDoctorReg['_id'],
    },
    name: string,
 }],

  following: [{
    _id: {
      type: IDoctorReg['_id'],
    },
    name: string,
  }],
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
  clinicCode: string;
  createdAt: Date;
  updatedAt: Date;
}