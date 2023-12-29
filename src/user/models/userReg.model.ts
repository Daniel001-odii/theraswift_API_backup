import { Schema, model } from "mongoose";
import { IUserReg } from "../interface/reg.interface";

const UserSchema = new Schema(
    {
      userId: {
        type: String,
        unique: true,
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
      firstName: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      mobileNumber: {
        type: Number,
        required: true,
        unique: true,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
      },
      refererCode: {
        type: String,
        unique: true,
      },
      refererCredit: {
        type: Number,
        default: 0,
      },
      reference: {
        type: String,
        default: "",
      },
      operatingLocation: {
        type: String,
        enum: ["Lagos", "Ogun"],
      },
      address: {
        type: String,
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
  
  const UserModel = model<IUserReg>("UserReg", UserSchema);
  
  export default UserModel;