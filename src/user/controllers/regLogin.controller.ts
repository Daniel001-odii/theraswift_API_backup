import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/userReg.model";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";

//admin signin /////////////
export const userSignUpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

  try {
    const {
      email,
      password,
      firstName,
      dateOfBirth,
      lastName,
      mobileNumber,
      gender
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
    let phonenumber = modifiedPhoneNumber(mobileNumber);

    const user = new UserModel({
      email: email,
      firstName: firstName,
      dateOfBirth: dateOfBirth,
      lastName: lastName,
      password: hashedPassword,
      mobileNumber: phonenumber,
      gender: gender,
    });
    
    let userSaved = await user.save();

    res.json({
      message: "Signup successful",
      user: {
        id: userSaved._id,
        firstName: userSaved.firstName,
        lastName: userSaved.lastName,
        email: userSaved.email,
        gender: userSaved.gender,
        mobileNumber: userSaved.mobileNumber,
      },

    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}