import { validationResult } from "express-validator";
import { Request, Response } from "express";
import DriverModel from "./../model/reg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";
import { sendSms } from "../../utils/sendSms.utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";

//driver send email /////////////
export const driverSendEmailController = async (
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
        const driver = await DriverModel.findOne({ email });
    
         // check if user exists
         if (!driver) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        driver!.emailOtp = {
            otp,
            createdTime,
            verified : false
        }

        await driver?.save();

        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: driver.firstName,
        };

        sendEmail(emailData);

        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//driver verified email /////////////
export const driverEmailVerificationController = async (
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
        const driver = await DriverModel.findOne({ email });
    
         // check if user exists
         if (!driver) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        if (driver.emailOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (driver.emailOtp.verified) {
            return res
            .status(401)
            .json({ message: "email already verified" });
        }

        const timeDiff = new Date().getTime() - driver.emailOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        driver.emailOtp.verified = true;

        await driver.save();

        return res.json({ message: "email verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}


//driver send phone number /////////////
export const driverSendPhoneNumberController = async (
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
        const driver = await DriverModel.findOne({ phoneNumber: phonenumber });
    
         // check if user exists
         if (!driver) {
          return res
            .status(401)
            .json({ message: "invalid mobile number" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        driver!.phoneNumberOtp = {
            otp,
            createdTime,
            verified : false
        }

        await driver?.save();

        let sms = `Hello ${
            driver!.firstName
        } your Theraswift mobile number verification OTP is ${otp}`;
      
        let data = { to: phonenumber, sms };

        sendSms(data);
        

        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//driver verified phone number /////////////
export const driverPhoneNumberVerificationController = async (
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
        const driver = await DriverModel.findOne({ mobileNumber: phonenumber });
    
         // check if user exists
         if (!driver) {
          return res
            .status(401)
            .json({ message: "invalid mobile number" });
        }

        if (driver.phoneNumberOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (driver.phoneNumberOtp.verified) {
            return res
            .status(401)
            .json({ message: "mobile number already verified" });
        }

        const timeDiff = new Date().getTime() - driver.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        driver.phoneNumberOtp.verified = true;

        await driver.save();

        return res.json({ message: "mobile number verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}