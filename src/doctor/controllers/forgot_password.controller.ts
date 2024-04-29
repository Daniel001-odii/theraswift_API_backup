import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import DoctorModel from "../modal/doctor_reg.modal";
import { generateOTP } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";
import { sendSms } from "../../utils/sendSms.utility";


export const doctorForgotPassworController = async (
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

    // try find doctor with the same email
    const doctor = await DoctorModel.findOne({ email });

    if (!doctor) {
        return res
        .status(401)
        .json({ message: "incorrect credential" });
    }

    //generate new otp
    const otp = generateOTP();

    doctor.passwordToken = parseInt(otp);
    doctor.passwordChangeStatus = true;

    await doctor.save();

    let emailData = {
      emailTo: email,
      subject: "Theraswift Email Verification",
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


export const doctorResetPassworController = async (
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

    // try find doctor with the same email
    const doctor = await DoctorModel.findOne({ email, passwordToken: otp });

    if (!doctor) {
        return res
        .status(401)
        .json({ message: "incorrect credential" });
    }

    if (doctor.passwordChangeStatus == false) {
        return res
        .status(401)
        .json({ message: "unable to reset password" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 

    doctor.passwordChangeStatus = false;
    doctor.password = hashedPassword;

    await doctor.save();

    return res.status(200).json({ message: "password successfully change" });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//doctor forgot password through mobile number /////////////
export const doctorMobileForgotPasswordController = async (
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
      const doctor = await DoctorModel.findOne({ phoneNumber: phonenumber });
  
       // check if user exists
       if (!doctor) {
        return res
          .status(401)
          .json({ message: "invalid phone number" });
      }

      const otp = generateOTP()

      const createdTime = new Date();

      doctor.passwordToken = parseInt(otp);
      doctor.passwordChangeStatus = true;

      await doctor?.save();

      let sms = `Hello ${
        doctor!.firstName
      } your Theraswift password change OTP is ${otp}`;
    
      let data = { to: phonenumber, sms };

      sendSms(data);
      
      return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
  
}


//doctor reset password through mobile number /////////////
export const doctorMobileResetPasswordController = async (
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
      const doctor = await DoctorModel.findOne({ phoneNumber: phonenumber, passwordToken: otp });
  
       // check if user exists
      if (!doctor) {
        return res
          .status(401)
          .json({ message: "invalid phone number 0r otp" });
      }

      if (doctor.passwordChangeStatus == false) {
        return res
        .status(401)
        .json({ message: "unable to reset password" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 

    doctor.passwordChangeStatus = false;
    doctor.password = hashedPassword;

    await doctor.save();

    return res.status(200).json({ message: "password successfully change" });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
  
}
