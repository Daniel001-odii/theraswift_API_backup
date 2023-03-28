import express, { Request, Response } from "express";
import UserModel from "../models/User.model";
import { sendSms } from "../utils/sendSmsUtility";
import { generateOTP } from "../utils/otpGenerator";
import { OTP_EXPIRY_TIME } from "../utils/utils";

// sending otp logic
export const mobileOtpController = async (req: Request, res: Response) => {
  const { mobileNumber } = req.body;

  try {
    // Check if the mobile number already exists in the database
    const existingUser = await UserModel.findOne({ mobileNumber });
    if(!existingUser){
      return res.json({
        message:"mobile number doesn't exist"
      })
    }
    // Generate a new OTP
    let otp = generateOTP();

    console.log(otp);

    // Save the OTP in the database
    const createdTime = new Date();

    existingUser!.mobileOtp = {
      otp,
      createdTime,
      verified: false,
    };

    await existingUser?.save();

    // Send the OTP to the mobile number using termii third-party SMS API
    let sms = `Hello ${
      existingUser!.firstName
    } your mobile number verification otp is ${otp}`;

    let data = { to: mobileNumber, sms };

    await sendSms(data);

    // For demo purposes, we'll just log the OTP to the console
    return res.json({
      message: `OTP sent successfully ${mobileNumber}: ${otp}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// verifying otp logic

export const mobileOtpVerificationController = async (
  req: Request,
  res: Response
) => {
  const { mobileNumber, otp } = req.body;

  try {
    // Check if the mobile number exists in the database
    const user = await UserModel.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: "Mobile number not found" });
    }

    // Check if the OTP is valid and not expired
    const { mobileOtp } = user;
    const timeDiff = new Date().getTime() - mobileOtp.createdTime.getTime();

    if (otp !== mobileOtp.otp || timeDiff > OTP_EXPIRY_TIME) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update the mobile OTP verification status to true
    user.mobileOtp.verified = true;
    await user.save();

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// resending otp logic

export const mobileOtpResendController = async (
  req: Request,
  res: Response
) => {
  const { mobileNumber } = req.body;

  try {
    // Check if the mobile number exists in the database
    const existingUser = await UserModel.findOne({ mobileNumber });

    if (!existingUser) {
      return res.status(400).json({ message: "Mobile number not found" });
    }

    // Generate a new OTP
    let otp = generateOTP();

    // Update the existing OTP in the database
    existingUser.mobileOtp = {
      otp,
      createdTime: new Date(),
      verified: false,
    };
    await existingUser.save();

    // Send the OTP to the mobile number using termii third-party SMS API
    let sms = `Hello ${
      existingUser!.firstName
    } your mobile number verification otp is ${otp}`;

    let data = { to: mobileNumber, sms };

    sendSms(data);

    return res.json({
      message: `New OTP sent successfully ${mobileNumber}: ${otp}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
