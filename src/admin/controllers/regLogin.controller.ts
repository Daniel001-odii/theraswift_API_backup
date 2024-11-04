import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AdminModel from "../models/admin_reg.model";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";



//admin signup /////////////
export const adminSignUpController = async (
  req: Request,
  res: Response,
) => {

try {
  const {
    email,
    password,
    firstName,
    dateOfBirth,
    lastName,
    phoneNumber,
    gender, 
    practiseCode
  } = req.body;
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // format mobile number to international format
  let phonenumber = modifiedPhoneNumber(phoneNumber);

  // try find user with the same email
  const adminEmailExists = await AdminModel.findOne({ email });
  const adminNumberExists = await AdminModel.findOne({ mobileNumber: phonenumber });

   // check if user exists
   if (adminEmailExists || adminNumberExists) {
    return res
      .status(401)
      .json({ message: "Email or Mobile Number exists already" });
  }

  let practiseCodeReal = "";
  let topAdmin = "no";

  if (practiseCode) {

    const checkPractiseCode = await AdminModel.findOne({practiseCode, topAdmin: "yes"});

    if (!checkPractiseCode) {
      return res
      .status(401)
      .json({ message: "incorrect practise code" });
    }

    practiseCodeReal = practiseCode
    
  } else {
    topAdmin = "yes"
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);


  const admin = new AdminModel({
    email: email,
    firstName: firstName,
    dateOFBirth: dateOfBirth,
    lastName: lastName,
    password: hashedPassword,
    phoneNumber: phonenumber,
    gender: gender,
    practiseCode: practiseCodeReal,
    topAdmin: topAdmin
  });
  
  let adminSaved = await admin.save();

  res.json({
    message: "Signup successful",
    user: {
      id: adminSaved._id,
      firstName: adminSaved.firstName,
      lastName: adminSaved.lastName,
      email: adminSaved.email,
      gender: adminSaved.gender,
      mobileNumber: adminSaved.phoneNumber,
    },

  });
  
} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}

}


//admin signin by email/////////////
export const adminSignInController = async (
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
  
      // try find admin with the same email
      const admin = await AdminModel.findOne({ email });
  
      // check if admin exists
      if (!admin) {
        return res
          .status(401)
          .json({ message: "incorrect credential" });
      }
  
      // compare password with hashed password in database
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "incorrect credential." });
      }

      if (!admin.emailOtp.verified) {
        return res.status(401).json({ message: "email not verified." });
       }
  
      // generate access token
      const accessToken = jwt.sign(
        { 
          id: admin?._id,
          email: admin.email,
        },
        process.env.JWT_ADMIN_SECRET_KEY!,
        //{ expiresIn: "24h" }
      );
  
      // return access token
      res.json({
        message: "Login successful",
        Token: accessToken,
        _id: admin?._id
      });
  
      
  } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
  }
}



//admin signin  with mobile number/////////////
export const adminMobileNumberSignInController = async (
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
  const admin = await AdminModel.findOne({ mobileNumber: phonenumber});

   // check if user exists
   if (!admin) {
    return res
      .status(401)
      .json({ message: "invalid credential" });
  }

 // compare password with hashed password in database
 const isPasswordMatch = await bcrypt.compare(password, admin.password);
 if (!isPasswordMatch) {
   return res.status(401).json({ message: "incorrect credential." });
 }

 if (!admin.phoneNumberOtp.verified) {
  return res.status(401).json({ message: "mobile number not verified." });
 }

 
  // generate access token
  const accessToken = jwt.sign(
    { 
      id: admin?._id,
      email: admin.email,
      mobileNumber: admin.phoneNumber,
    },
    process.env.JWT_User_SECRET_KEY!,
    //{ expiresIn: "24h" }
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