import { validationResult } from "express-validator";
import { Request, Response, } from "express";
import bcrypt from "bcrypt";
import DriverModel from "./../model/reg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";
import { sendSms } from "../../utils/sendSms.utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";

// driver email forgot password
export const driverEmailForgotPassworController = async (
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

    // try find admin with the same email
    const driver = await DriverModel.findOne({ email });

    if (!driver) {
        return res
        .status(401)
        .json({ message: "incorrect credential" });
    }

    //generate new otp
    const otp = generateOTP();
    const createdTime = new Date();

    driver.passwordOtp = {
        otp,
        createdTime,
        verified: true
    };

    await driver.save();

    let emailData = {
      emailTo: email,
      subject: "Theraswift password change",
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


// driver email reset password
export const driverResetPassworController = async (
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

    // try find admin with the same email
    const driver = await DriverModel.findOne({ email,});

    if (!driver) {
        return res
        .status(401)
        .json({ message: "incorrect credential" });
    }

    const {createdTime, verified} = driver.passwordOtp

    const timeDiff = new Date().getTime() - createdTime.getTime();

    if (verified == false || timeDiff > OTP_EXPIRY_TIME || otp !== driver.passwordOtp.otp) {
        return res
        .status(401)
        .json({ message: "unable to reset password" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 

    driver.password = hashedPassword;
    driver.passwordOtp.verified = false;

    await driver.save();

    return res.status(200).json({ message: "password successfully change" });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//driver forgot password through mobile number /////////////
export const driverMobileForgotPasswordController = async (
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
            .json({ message: "invalid phone number" });
        }
  
        const otp = generateOTP()
  
        const createdTime = new Date();
  
        driver!.passwordOtp = {
            otp,
            createdTime,
            verified : true
        }
  
        await driver?.save();
  
        let sms = `Hello ${
            driver!.firstName
        } your Theraswift password change OTP is ${otp}`;
      
        let data = { to: phonenumber, sms };
  
        sendSms(data);
        
  
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//driver reset password through mobile number /////////////
export const driverMobileResetPasswordController = async (
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
        const driver = await DriverModel.findOne({ phoneNumber: phonenumber });
    
         // check if user exists
        if (!driver) {
          return res
            .status(401)
            .json({ message: "invalid phone number" });
        }
  
        const {createdTime, verified} = driver.passwordOtp
  
        const timeDiff = new Date().getTime() - createdTime.getTime();
  
        if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== driver.passwordOtp.otp) {
            return res
            .status(401)
            .json({ message: "unable to reset password" });
        }
  
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); 
  
        driver.password = hashedPassword;
        driver.passwordOtp.verified = false;
  
        await driver.save();
  
        return res.status(200).json({ message: "password successfully change" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}