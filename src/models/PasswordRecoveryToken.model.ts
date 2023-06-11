import { IPasswordResetToken } from "../interface/generalInterface";
import {Schema,model} from "mongoose";

const PasswordResetTokenSchema = new Schema({
  otp: { type: String, required: true },
  token: { type: String, required: true },
  userId: String,
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  tokenExpirationTime: { type: Date, required: true },
  otpExpirationTime: { type: Date, required: true },
});

const PasswordResetToken = model<IPasswordResetToken>(
  "PasswordResetToken",
  PasswordResetTokenSchema
);

export default PasswordResetToken;
