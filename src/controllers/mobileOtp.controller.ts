import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import otpGenerator from "otp-generator";
// import nodemailer from "nodemailer";
import UserModel from "../models/User.model";
import request from "request";

// Define the OTP expiration time
const OTP_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// sending otp logic
export const mobileOtpController = async (req: Request, res: Response) => {
  const { mobileNumber } = req.body;

  try {
    // Check if the mobile number already exists in the database
    const existingUser = await UserModel.findOne({ mobileNumber });

    // Generate a new OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
    });

    console.log(otp);

    // Save the OTP in the database
    const createdTime = new Date();

    existingUser!.mobileOtp = {
      otp,
      createdTime,
      verified: false,
    };
    await existingUser?.save();

    // Send the OTP to the mobile number using a third-party SMS API

    var data = {
      to: "2347053578760",
      from: "THERASWIFT",
      sms: "Hi there, testing Termii",
      type: "plain",
      api_key: "TLQuyFMJ4VTHRgNj6URWPoaULuwWWJdI90CckJlZgWp9bvG34m49kpt2LIOLEB",
      channel: "generic",
    };
    var options = {
      method: "POST",
      url: "https://api.ng.termii.com/api/sms/send",
      headers: {
        "Content-Type": ["application/json", "application/json"],
      },
      body: JSON.stringify(data),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });

    // For demo purposes, we'll just log the OTP to the console
    console.log(`OTP for mobile number ${mobileNumber}: ${otp}`);

    return res.json({ message: "OTP sent successfully" });
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
    const otp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
    });

    // Update the existing OTP in the database
    existingUser.mobileOtp = {
      otp,
      createdTime: new Date(),
      verified: false,
    };
    await existingUser.save();

    // Send the OTP to the mobile number using a third-party SMS API

    // For demo purposes, we'll just log the OTP to the console
    console.log(`New OTP for mobile number ${mobileNumber}: ${otp}`);

    return res.json({ message: "New OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
