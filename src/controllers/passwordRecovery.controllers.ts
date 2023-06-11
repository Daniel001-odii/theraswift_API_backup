import { Request, Response } from "express";
import bcrypt from "bcrypt";
import PasswordResetTokenModel from "../models/PasswordRecoveryToken.model";
import UserModel from "../models/User.model";
import { generateOTP } from "../utils/otpGenerator";
import { sendPasswordRecoveryEmail } from "../utils/sendEmailUtility";
import { sendSms } from "../utils/sendSmsUtility";
import { OTP_EXPIRY_TIME } from "../utils/utils";
import crypto from "crypto";

// send otp mail to the users gmail & save it to the database
export const emailOtpRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a new OTP
    let otp = generateOTP();

    // Save the OTP in the database
    const createdTime = new Date();

    const tokenExists = await PasswordResetTokenModel.findOne({ email });

    if (tokenExists) {
      tokenExists.otp = otp;
      tokenExists.otpExpirationTime = createdTime;

      await tokenExists?.save();

      return res.status(201).send({ message: "otp sent successfully!" });
    }

    let newPasswordResetToken = new PasswordResetTokenModel({
      otp,
      otpExpirationTime: createdTime,
    });

    let emailData = {
      emailTo: email,
      subject: "Theraswift Password Recovery OTP",
      otp,
      firstName: user.firstName,
    };

    await sendPasswordRecoveryEmail(emailData);

    let newOtpEntry = await newPasswordResetToken?.save();

    res.status(201).send({ message: "otp sent successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// send sms otp to the users mobile phone & save it to the database or update
export const smsOtpRequestController = async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    // Check if the user exists
    const user = await UserModel.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a new OTP
    let otp = generateOTP();

    // Save the OTP in the database
    const createdTime = new Date();

    const tokenExists = await PasswordResetTokenModel.findOne({ mobileNumber });

    if (tokenExists) {
      tokenExists.otp = otp;
      tokenExists.otpExpirationTime = createdTime;

      await tokenExists?.save();

      return res.status(201).send({ message: "otp sent successfully!" });
    }

    let newPasswordResetToken = new PasswordResetTokenModel({
      otp,
      otpExpirationTime: createdTime,
      userId: user.userId,
    });

    // Send the OTP to the mobile number using termii third-party SMS API
    let sms = `Hello ${
      user!.firstName
    } your Theraswift password recovery verification OTP is ${otp}`;

    let data = { to: mobileNumber, sms };

    sendSms(data);

    let newOtpEntry = await newPasswordResetToken?.save();

    res.status(201).send({ message: "otp sent successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// verify the otp and create a token and save it in the db

export const verifyPasswordRecoveryOtpController = async (
  req: Request,
  res: Response
) => {
  const { otp } = req.body;

  try {
    // Check if the otp exists in the database
    const otpExists = await PasswordResetTokenModel.findOne({ otp });

    if (!otpExists) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if the OTP is valid and not expired

    const timeDiff =
      new Date().getTime() - otpExists.otpExpirationTime.getTime();

    if (otp !== otpExists.otp || timeDiff > OTP_EXPIRY_TIME) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate a token with a length of 8
    const token = crypto.randomBytes(4).toString("hex");

    const createdTime = new Date();

    otpExists.token = token;
    otpExists.tokenExpirationTime = createdTime;

    await otpExists.save();

    const hashedToken = await bcrypt.hash(token, 10);

    return res.json({ passwordRecoveryToken: hashedToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updatePasswordController = async (req: Request, res: Response) => {
  const { token, password, email, mobileNumber } = req.body;

  let passwordResetTokenInfo: any;

  if (email && mobileNumber)
    return res
      .status(400)
      .json({ message: "either password or email should be provided" });

  // Find the token in the database
  if (email) {
    passwordResetTokenInfo = await PasswordResetTokenModel.findOne({ email });
  }

  if (mobileNumber) {
    passwordResetTokenInfo = await PasswordResetTokenModel.findOne({
      mobileNumber,
    });
  }

  const isTokenMatch = await bcrypt.compare(
    token,
    passwordResetTokenInfo.token
  );

  if (!isTokenMatch)
    return res.status(500).json({ message: "Invalid password recovery token" });

  const timeDiff =
    new Date().getTime() - passwordResetTokenInfo.tokenExpirationTime.getTime();

  if (timeDiff > OTP_EXPIRY_TIME) {
    return res.status(400).json({ message: "Invalid password recovery token" });
  }

  // Update the user's password in the database
  const user = await UserModel.findOne(passwordResetTokenInfo.userId);

  if(!user) return res.status(400).json({ message: "User not found" }); 

  const hashedPassword = await bcrypt.hash(token, 10);

  user.password = hashedPassword;

  await user.save();

  // Invalidate the token by deleting it from the database
  await passwordResetTokenInfo.delete();

  res.status(200).json({ message: "Password updated successfully" });
};
