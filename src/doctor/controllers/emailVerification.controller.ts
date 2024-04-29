import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import DoctotModel from "../modal/doctor_reg.modal";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";
import { sendSms } from "../../utils/sendSms.utility";


//doctor send email /////////////
export const doctorSendEmailController = async (
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
        const doctor = await DoctotModel.findOne({ email });
    
         // check if user exists
         if (!doctor) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        doctor!.emailOtp = {
            otp,
            createdTime,
            verified : false
        }

        await doctor?.save();

        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: doctor.firstName,
        };

        sendEmail(emailData);

        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//doctor verified email /////////////
export const doctorEmailVerificationController = async (
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
        const doctor = await DoctotModel.findOne({ email });
    
         // check if user exists
         if (!doctor) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        if (doctor.emailOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (doctor.emailOtp.verified) {
            return res
            .status(401)
            .json({ message: "email already verified" });
        }

        const timeDiff = new Date().getTime() - doctor.emailOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        doctor.emailOtp.verified = true;

        await doctor.save();

        return res.json({ message: "email verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}


//doctor send phone number /////////////
export const doctorSendPhoneNumberController = async (
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
      const doctor = await DoctotModel.findOne({ phoneNumber: phonenumber });
  
       // check if user exists
       if (!doctor) {
        return res
          .status(401)
          .json({ message: "invalid mobile number" });
      }

      const otp = generateOTP()

      const createdTime = new Date();

      doctor!.phoneNumberOtp = {
          otp,
          createdTime,
          verified : false
      }

      await doctor?.save();

      let sms = `Hello ${
        doctor!.firstName
      } your Theraswift mobile number verification OTP is ${otp}`;
    
      let data = { to: phonenumber, sms };

      sendSms(data);
      
      return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
  
}


//doctor verified phone number /////////////
export const doctorPhoneNumberVerificationController = async (
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
      const doctor = await DoctotModel.findOne({ phoneNumber: phonenumber });
  
       // check if user exists
       if (!doctor) {
        return res
          .status(401)
          .json({ message: "invalid mobile number" });
      }

      if (doctor.phoneNumberOtp.otp != otp) {
          return res
          .status(401)
          .json({ message: "invalid otp" });
      }

      if (doctor.phoneNumberOtp.verified) {
          return res
          .status(401)
          .json({ message: "mobile number already verified" });
      }

      const timeDiff = new Date().getTime() - doctor.phoneNumberOtp.createdTime.getTime();
      if (timeDiff > OTP_EXPIRY_TIME) {
          return res.status(400).json({ message: "otp expired" });
      }

      doctor.phoneNumberOtp.verified = true;

      await doctor.save();

      return res.json({ message: "mobile number verified successfully" });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
}