import { ExpressArgs } from "../types/generalTypes";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { userIdGen } from "../utils/userIdGen";
import { modifiedPhoneNumber } from "../utils/mobileNumberFormatter";

// login users
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, mobileNumber } = req.body;

    if (email && mobileNumber) {
      return res.status(500).json({
        message: "Please pass in either a mobile number or an email address",
      });
    } 

    let user;

    if (email) {
      // try find user with email
      user = await UserModel.findOne({ email });
    } else if (mobileNumber) {
      // try find user with email
      let phoneNumber = modifiedPhoneNumber(mobileNumber);
      user = await UserModel.findOne({ mobileNumber: phoneNumber });
    }

    // check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // generate access token
    const accessToken = jwt.sign(
      { 
        _id: user?._id,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user?._id,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.REFRESH_JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );

    // return access token
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        role: user.role,
        walletBalance: user.theraWallet,
        dateOfBirth: user?.dateOfBirth,
      },
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    // login error
    res.status(500).json({ message: err.message });
  }
};



// login doctors

export const doctorsLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, mobileNumber } = req.body;

    if (email && mobileNumber) {
      return res.status(500).json({
        message: "Please pass in either a mobile number or an email address",
      });
    } 

    let user;

    if (email) {

      // try find user with email
       user = await UserModel.findOne({
        email,
        role: { $in: ["doctor", "admin"] },
      });
  
     
    } else if (mobileNumber) {

      // try find user with email
      let phoneNumber = modifiedPhoneNumber(mobileNumber);

      user =  await UserModel.findOne({
        mobileNumber: phoneNumber,
        role: { $in: ["admin", "doctor"] },
      });
      
    }

    // check if user exists
    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid credentials." });
    }

    // compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, user.password);


    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // generate access token
    const accessToken = jwt.sign(
      { 
        _id: user?._id,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user?._id,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.REFRESH_JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );

    // return access token
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        role: user.role,
        walletBalance: user.theraWallet,
        dateOfBirth: user?.dateOfBirth,
      },
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    // login error
    res.status(500).json({ message: err.message });
  }
};

