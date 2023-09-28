import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendSms } from "../../utils/sendSms.utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";

//user send email /////////////
export const userSendPhoneNumberController = async (
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
            .json({ message: "invalid mobile number" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        user!.phoneNumberOtp = {
            otp,
            createdTime,
            verified : false
        }

        await user?.save();

        let sms = `Hello ${
            user!.firstName
        } your Theraswift mobile number verification OTP is ${otp}`;
      
        let data = { to: phonenumber, sms };

        sendSms(data);
        

        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}

//user verified phone number /////////////
export const userPhoneNumberVerificationController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
            mobileNumber,
            otp
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
            .json({ message: "invalid mobile number" });
        }

        if (user.phoneNumberOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (user.phoneNumberOtp.verified) {
            return res
            .status(401)
            .json({ message: "mobile number already verified" });
        }

        const timeDiff = new Date().getTime() - user.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        user.phoneNumberOtp.verified = true;

        await user.save();

        return res.json({ message: "mobile number verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}

