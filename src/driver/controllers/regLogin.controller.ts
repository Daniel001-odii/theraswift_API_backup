import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import DriverModel from "./../model/reg.model";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";


//driver signup /////////////
export const driverSignUpController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      gender, 
      city,
      licensePlate
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    // format mobile number to international format
    let phonenumber = modifiedPhoneNumber(phoneNumber);
  
    // try find user with the same email
    const driverEmailExists = await DriverModel.findOne({ email });
    const driverNumberExists = await DriverModel.findOne({ phoneNumber });
  
     // check if user exists
     if (driverEmailExists || driverNumberExists) {
      return res
        .status(401)
        .json({ message: "Email or Mobile Number exists already" });
    }
  

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
  
    const driver = new DriverModel({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      phoneNumber: phonenumber,
      gender: gender,
      city,
      licensePlate
    });
    
    let driverSaved = await driver.save();
  
    res.json({
      message: "Signup successful",
      driver: {
        id: driverSaved._id,
        firstName: driverSaved.firstName,
        lastName: driverSaved.lastName,
        email: driverSaved.email,
        gender: driverSaved.gender,
        mobileNumber: driverSaved.phoneNumber
      },
  
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


//driver signin by email/////////////
export const driverEmailSignInController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {
      const {
        email,
        password,
      } = req.body;
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // try find driver with the same email
      const driver = await DriverModel.findOne({ email });
  
      // check if admin exists
      if (!driver) {
        return res
          .status(401)
          .json({ message: "incorrect credential" });
      }
  
      // compare password with hashed password in database
      const isPasswordMatch = await bcrypt.compare(password, driver.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "incorrect credential." });
      }

      if (!driver.emailOtp.verified) {
        return res.status(401).json({ message: "email not verified." });
       }
  
      // generate access token
      const accessToken = jwt.sign(
        { 
          id: driver?._id,
          email: driver.email,
        },
        process.env.JWT_Driver_SECRET_KEY!,
        { expiresIn: "24h" }
      );
  
      // return access token
      res.json({
        message: "Login successful",
        Token: accessToken
      });
  
      
  } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
}


//driver signin  with mobile number/////////////
export const driverMobileNumberSignInController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      mobileNumber,
      password,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    // format mobile number to international format
    let phonenumber = modifiedPhoneNumber(mobileNumber);
  
    // try find user with the same email
    const driver = await DriverModel.findOne({ phoneNumber: phonenumber});
  
     // check if user exists
     if (!driver) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }
  
   // compare password with hashed password in database
   const isPasswordMatch = await bcrypt.compare(password, driver.password);
   if (!isPasswordMatch) {
     return res.status(401).json({ message: "incorrect credential." });
   }
  
   if (!driver.phoneNumberOtp.verified) {
    return res.status(401).json({ message: "mobile number not verified." });
   }
  
   
    // generate access token
    const accessToken = jwt.sign(
      { 
        id: driver?._id,
        email: driver.email,
        mobileNumber: driver.phoneNumber,
      },
      process.env.JWT_Driver_SECRET_KEY!,
      { expiresIn: "24h" }
    );
  
    // return access token
    res.json({
      message: "Login successful",
      Token: accessToken
    });
  
  
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
  }