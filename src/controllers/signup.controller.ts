import { validationResult } from "express-validator";
import { ExpressArgs } from "../types/generalTypes";
import UserModel from "../models/User.model";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userIdGen } from "../utils/userIdGen";
import { modifiedPhoneNumber } from "../utils/mobileNumberFormatter";

// signup logic
export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      firstName,
      lastName,
      mobileNumber,
      password,
      dateOfBirth,
      gender,
      role,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email
    const userEmailExists = await UserModel.findOne({ email });
    const userNumberExists = await UserModel.findOne({ mobileNumber });

    // check if user exists
    if (userEmailExists || userNumberExists) {
      return res
        .status(401)
        .json({ message: "Email or Mobile Number exists already" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // format mobile number to international format
    let newNum = modifiedPhoneNumber(mobileNumber);

    // getting userID out of users mobile number
    let userId = userIdGen(mobileNumber);

    // Save user to MongoDB
    const user = new UserModel({
      userId,
      email,
      firstName,
      dateOfBirth,
      lastName,
      password: hashedPassword,
      mobileNumber: newNum,
      gender,
      role,
    });
    let userSaved = await user.save();

    // generate access token
    const accessToken = jwt.sign(
      {
        _id: userSaved?._id,
        userId: userSaved.userId,
        email: userSaved.email,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        mobileNumber: user.mobileNumber,
        role: userSaved.role,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        _id: userSaved?._id,
        userId: userSaved.userId,
        email: userSaved.email,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        mobileNumber: user.mobileNumber,
        role: userSaved.role,
      },
      process.env.REFRESH_JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Signup successful",
      user: {
        _id: userSaved._id,
        userId: userSaved.userId,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        email: userSaved.email,
        gender: userSaved.gender,
        mobileNumber: userSaved.mobileNumber,
        role: userSaved.role,
        walletBalance: userSaved.theraWallet,
        dateOfBirth: userSaved.dateOfBirth,
      },
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
};

export const addAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      firstName,
      lastName,
      mobileNumber,
      password,
      dateOfBirth,
      gender,
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // try find user with the same email

    const userEmailExists = await UserModel.findOne({ email });
    const userNumberExists = await UserModel.findOne({ mobileNumber });

    // check if user exists
    if (userEmailExists || userNumberExists) {
      return res
        .status(401)
        .json({
          message:
            "Email or mobile number exists already, consider making user admin.",
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // format mobile number to international format
    let newNum = modifiedPhoneNumber(mobileNumber);

    // getting userID out of users mobile number
    let userId = userIdGen(mobileNumber);

    // Save user to MongoDB
    const user = new UserModel({
      userId,
      email,
      firstName,
      dateOfBirth,
      lastName,
      password: hashedPassword,
      mobileNumber: newNum,
      gender,
      role: "admin",
    });

    let adminSaved = await user.save();

    // generate access token
    const accessToken = jwt.sign(
      {
        _id: adminSaved?._id,
        userId: adminSaved.userId,
        email: adminSaved.email,
        firstName: adminSaved.firstName,
        lastName: adminSaved.lastName,
        mobileNumber: user.mobileNumber,
        role: adminSaved.role,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        _id: adminSaved?._id,
        userId: adminSaved.userId,
        email: adminSaved.email,
        firstName: adminSaved.firstName,
        lastName: adminSaved.lastName,
        mobileNumber: user.mobileNumber,
        role: adminSaved.role,
      },
      process.env.REFRESH_JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Admin added successfully",
      user: {
        _id: adminSaved._id,
        userId: adminSaved.userId,
        firstName: adminSaved.firstName,
        lastName: adminSaved.lastName,
        email: adminSaved.email,
        gender: adminSaved.gender,
        mobileNumber: adminSaved.mobileNumber,
        role: adminSaved.role,
        walletBalance: adminSaved.theraWallet,
        dateOfBirth: adminSaved.dateOfBirth,
      },
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
};

export const makeUserAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;

    // check if user exists
    if (!userId) {
      return res.status(401).json({ message: "Please send userId." });
    }

    // try find user with the same userId
    const userExists = await UserModel.findOne({ userId });

    // check if user exists
    if (!userExists) {
      return res.status(401).json({ message: "User does not exists." });
    }

    const updatedUserRole = await UserModel.findByIdAndUpdate(
      userExists?._id,
      { role: "admin" },
      { new: true }
    );

    res.status(200).json({
      message: "User made admin successfully",
      user: updatedUserRole,
    });
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
};
