import { Schema, model } from "mongoose";
import { IAdminReg } from "../interface/reg.interface";

const AdminSchema = new Schema(
    {
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
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      dateOFBirth: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
        unique: true,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
      },
      practiseCode: {
        type: String,
        default: ""
      },
      topAdmin: {
        type: String,
        enum: ["yes", "no"],
        default: "no"
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      passwordOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
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
    
    },
    {
      timestamps: true,
    }
  );
  
  const AdminModel = model<IAdminReg>("AdminReg", AdminSchema);
  
  export default AdminModel;