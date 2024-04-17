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
      superDoctor: {
        type: Boolean
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
      passwordToken: {
        type: Number
      },
      passwordChangeStatus: {
        type: Boolean
      }
    
    },
    {
      timestamps: true,
    }
  );
  
  const DoctotModel = model<IDoctorReg>("DoctorReg", DoctorSchema);
  
  export default DoctotModel;