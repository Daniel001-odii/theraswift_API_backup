import express, { Request, Response } from "express";
import UserModel from "../models/User.model";
import { generateOTP } from "../utils/otpGenerator";
import { OTP_EXPIRY_TIME } from "../utils/utils";
import { sendEmail } from "../utils/sendEmailUtility";

// Define the endpoint to send the OTP to email
export const sendEmailController = async (req: Request, res: Response) => {
  const { email = "yusufmustahan@gmail.com" } = req.body;
  try {
    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Email does not exists" });
    }

    // Generate a new OTP
    let otp = generateOTP();

    // Save the OTP in the database
    const createdTime = new Date();

    existingUser!.emailOtp = {
      otp,
      createdTime,
      verified: false,
    };

    await existingUser?.save();

    let emailData = {
      emailTo: email,
      subject: "Theraswift Email Verification",
      otp,
      firstName: existingUser.firstName,
    };

    await sendEmail(emailData);

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// verifying email otp logic
export const verifyEmailController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    // Check if the email exists in the database
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Check if the OTP is valid and not expired
    const { emailOtp } = user;
    const timeDiff = new Date().getTime() - emailOtp.createdTime.getTime();

    if (otp !== emailOtp.otp || timeDiff > OTP_EXPIRY_TIME) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update the email OTP verification status to true
    user.emailOtp.verified = true;

    await user.save();

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// resending otp logic

export const resendEmailController = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Find user by email
    const existingUser = await UserModel.findOne({ email });

    // Check if user exists
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new OTP
    let otp = generateOTP();

    // Save the OTP in the database
    const createdTime = new Date();

    existingUser!.emailOtp = {
      otp,
      createdTime,
      verified: false,
    };

    await existingUser?.save();

    let emailData = {
      emailTo: email,
      subject: "Theraswift Email Verification",
      otp,
      firstName: existingUser.firstName,
    };

    sendEmail(emailData);

    // // Send email message
    // await sendEmail(emailData);

    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
