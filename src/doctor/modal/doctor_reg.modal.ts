import { Schema, model } from "mongoose";
import { IDoctorReg } from "../interface/reg_interface";

const DoctorSchema = new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      organization: {
        type: String,
        enum: ["clinic", "hospital", "HMO"],
        required: true,
      },
      clinicCode: {
        type: String,
        default: '',
      },
      requestClinicCode: {
        type: String,
        enum: ["request", "given"],
      },
      verifyClinicCode: {
        type: Boolean,
      },
      superDoctor: {
        type: Boolean,
        default: false,
      },
      addresss: {
        type: String,
        required: true,
      },
      speciality: {
        type: String,
        required: true,
      },
      regNumber: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      
      emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      phoneNumberOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      passwordToken: {
        type: Number
      },
      passwordChangeStatus: {
        type: Boolean
      },
     verification: {
      isVerified: Boolean,
      date: {
        type: Date,
        default: Date.now,
      }
     }
    
    },
    {
      timestamps: true,
    }
  );
  
  const DoctotModel = model<IDoctorReg>("DoctorReg", DoctorSchema);
  
  export default DoctotModel;