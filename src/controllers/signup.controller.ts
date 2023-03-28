import { validationResult } from "express-validator";
import { ExpressArgs } from "../types/generalTypes";
import UserModel from "../models/User.model";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
    const userEmailOrNumber = await UserModel.findOne({ email, mobileNumber });

    console.log(userEmailOrNumber);

    // check if user exists
    if (userEmailOrNumber) {
      return res.status(401).json({ message: "Email or Mobile Number exists already" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    

    const modifiedPhoneNumber = ()=>{
      if (mobileNumber.charAt(0) === "0") {
        let n = mobileNumber.substring(1);
        return "234" + n.toString()
      } else {
        return mobileNumber.toString()
      }
    } 

    let newNum =  modifiedPhoneNumber()

    console.log(newNum);
  

    // Save user to MongoDB
    const user = new UserModel({
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
        email: userSaved.email,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        role: userSaved.role,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Signup successful",
      user: {
        _id: userSaved._id,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        email: userSaved.email,
        gender: userSaved.gender,
        mobileNumber: userSaved.mobileNumber,
        role: userSaved.role,
      },
      accessToken,
    });
  } catch (err) {
    // signup error
    next?.(err);
  }
};

export default signup;





