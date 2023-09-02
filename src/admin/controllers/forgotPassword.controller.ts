import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import AdminModel from "../models/admin_reg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";

export const adminForgotPassworController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
      email,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find admin with the same email
    const admin = await AdminModel.findOne({ email });

    if (!admin) {
        return res
        .status(401)
        .json({ message: "incorrect credential" });
    }

    //generate new otp
    const otp = generateOTP();
    const createdTime = new Date();

    admin.passwordOtp = {
        otp,
        createdTime,
        verified: true
    };

    await admin.save();

    let emailData = {
      emailTo: email,
      subject: "Theraswift password change",
      otp,
      firstName: "admin",
    };

    sendEmail(emailData);

    return res.status(200).json({ message: "OTP sent successfully to your email." });


  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


export const adminResetPassworController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
      email,
      otp,
      password
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find admin with the same email
    const admin = await AdminModel.findOne({ email,});

    if (!admin) {
        return res
        .status(401)
        .json({ message: "incorrect credential" });
    }

    const {createdTime, verified} = admin.passwordOtp

    const timeDiff = new Date().getTime() - createdTime.getTime();

    if (verified == false || timeDiff > OTP_EXPIRY_TIME || otp !== admin.passwordOtp.otp) {
        return res
        .status(401)
        .json({ message: "unable to reset password" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 

    admin.password = hashedPassword;
    admin.passwordOtp.verified = false;

    await admin.save();

    return res.status(200).json({ message: "password successfully change" });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}
