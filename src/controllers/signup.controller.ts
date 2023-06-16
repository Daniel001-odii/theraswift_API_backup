import { validationResult } from "express-validator";
import { ExpressArgs } from "../types/generalTypes";
import UserModel from "../models/User.model";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userIdGen } from "../utils/userIdGen";
import { modifiedPhoneNumber } from "../utils/mobileNumberFormatter";

// signup logic
const signup = async (req: Request, res: Response, next: NextFunction) => {
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

    // console.log(userEmailExists,userNumberExists);

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
    console.log("newNum ",newNum);
    // getting userID out of users mobile number
    let userId = userIdGen(mobileNumber);

    // Save user to MongoDB
    const user = new UserModel({
      userId,
      email: email,
      firstName: firstName,
      dateOfBirth: dateOfBirth,
      lastName: lastName,
      password: hashedPassword,
      mobileNumber: newNum,
      gender: gender,
    });
    let userSaved = await user.save();
    console.log(userSaved);
    // generate access token
    const accessToken = jwt.sign(
      {
        userId: userSaved.userId,
        email: userSaved.email,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        role: userSaved.role,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );


    const refreshToken = jwt.sign(
      {
        userId: userSaved.userId,
        email: userSaved.email,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
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
        dateOfBirth: userSaved.dateOfBirth
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    // signup error
    next?.(err);
  }
};

export default signup;
