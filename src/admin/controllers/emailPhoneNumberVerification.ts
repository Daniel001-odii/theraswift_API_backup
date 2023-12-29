import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminModel from "../models/admin_reg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";
import { sendSms } from "../../utils/sendSms.utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";

//admin send email /////////////
export const adminSendEmailController = async (
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
        const admin = await AdminModel.findOne({ email });
    
         // check if user exists
         if (!admin) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        admin!.emailOtp = {
            otp,
            createdTime,
            verified : false
        }

        await admin?.save();

        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: admin.firstName,
        };

        sendEmail(emailData);

        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//admin verified email /////////////
export const adminEmailVerificationController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
          email,
          otp
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // try find user with the same email
        const admin = await AdminModel.findOne({ email });
    
         // check if user exists
         if (!admin) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        if (admin.emailOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (admin.emailOtp.verified) {
            return res
            .status(401)
            .json({ message: "email already verified" });
        }

        const timeDiff = new Date().getTime() - admin.emailOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        admin.emailOtp.verified = true;

        await admin.save();

        return res.json({ message: "email verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}



//admin send phone number /////////////
export const adminSendPhoneNumberController = async (
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
        const admin = await AdminModel.findOne({ phoneNumber: phonenumber });
    
         // check if user exists
         if (!admin) {
          return res
            .status(401)
            .json({ message: "invalid mobile number" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        admin!.phoneNumberOtp = {
            otp,
            createdTime,
            verified : false
        }

        await admin?.save();

        let sms = `Hello ${
            admin!.firstName
        } your Theraswift mobile number verification OTP is ${otp}`;
      
        let data = { to: phonenumber, sms };

        sendSms(data);
        

        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}

//admin verified phone number /////////////
export const adminPhoneNumberVerificationController = async (
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
        const admin = await AdminModel.findOne({ mobileNumber: phonenumber });
    
         // check if user exists
         if (!admin) {
          return res
            .status(401)
            .json({ message: "invalid mobile number" });
        }

        if (admin.phoneNumberOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (admin.phoneNumberOtp.verified) {
            return res
            .status(401)
            .json({ message: "mobile number already verified" });
        }

        const timeDiff = new Date().getTime() - admin.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        admin.phoneNumberOtp.verified = true;

        await admin.save();

        return res.json({ message: "mobile number verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}


