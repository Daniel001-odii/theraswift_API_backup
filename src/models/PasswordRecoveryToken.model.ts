import { IPasswordResetToken } from "../interface/generalInterface";
import mongoose from "mongoose";

const PasswordResetTokenSchema = new mongoose.Schema({

  otp: { type: String, required: true },
  token: { type: String, required: true },
  userId: String,
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  tokenExpirationTime: { type: Date, required: true },
  otpExpirationTime: { type: Date, required: true },
});

const PasswordResetToken = mongoose.model<IPasswordResetToken>(
  "PasswordResetToken",
  PasswordResetTokenSchema
);

export default PasswordResetToken;
