import { validationResult } from "express-validator";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/userReg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendSms } from "../../utils/sendSms.utility";
import { sendEmail } from "../../utils/send_email_utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";

//user forgot password through email /////////////
export const userEmailForgotPasswordController = async (
    req: Request,
    res: Response,
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
    
        // try find user with the same email
        const user = await UserModel.findOne({ email });
    
         // check if user exists
         if (!user) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        user!.passwordOtp = {
            otp,
            createdTime,
            verified : true
        }

        await user?.save();

        let emailData = {
            emailTo: email,
            subject: "Theraswift password change",
            otp,
            firstName: user.firstName,
        };
      
        sendEmail(emailData);
    
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//user reset password through email /////////////
export const userEmailResetPasswordController = async (
    req: Request,
    res: Response,
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
    
        // try find user with the same email
        const user = await UserModel.findOne({ email });
    
         // check if user exists
        if (!user) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const {createdTime, verified} = user.passwordOtp

        const timeDiff = new Date().getTime() - createdTime.getTime();

        if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== user.passwordOtp.otp) {
            return res
            .status(401)
            .json({ message: "unable to reset password" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); 

        user.password = hashedPassword;
        user.passwordOtp.verified = false;

        await user.save();

        return res.status(200).json({ message: "password successfully change" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//user forgot password through mobile number /////////////
export const userMobileForgotPasswordController = async (
    req: Request,
    res: Response,
) => {

    try {
        const {
            mobileNumber,
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // format mobile number to international format
        let phonenumber = modifiedPhoneNumber(mobileNumber);
    
        // try find user with the same email
        const user = await UserModel.findOne({ mobileNumber: phonenumber });
    
         // check if user exists
         if (!user) {
          return res
            .status(401)
            .json({ message: "invalid phone number" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        user!.passwordOtp = {
            otp,
            createdTime,
            verified : true
        }

        await user?.save();

        let sms = `Hello ${
            user!.firstName
        } your Theraswift password change OTP is ${otp}`;
      
        let data = { to: phonenumber, sms };

        sendSms(data);
        

        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}

//user reset password through mobile number /////////////
export const userMobileResetPasswordController = async (
    req: Request,
    res: Response,
) => {

    try {
        const {
            mobileNumber,
            otp,
            password
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // format mobile number to international format
        let phonenumber = modifiedPhoneNumber(mobileNumber);
    
        // try find user with the same phone number
        const user = await UserModel.findOne({ mobileNumber: phonenumber });
    
         // check if user exists
        if (!user) {
          return res
            .status(401)
            .json({ message: "invalid phone number" });
        }

        const {createdTime, verified} = user.passwordOtp

        const timeDiff = new Date().getTime() - createdTime.getTime();

        if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== user.passwordOtp.otp) {
            return res
            .status(401)
            .json({ message: "unable to reset password" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); 

        user.password = hashedPassword;
        user.passwordOtp.verified = false;

        await user.save();

        return res.status(200).json({ message: "password successfully change" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}
