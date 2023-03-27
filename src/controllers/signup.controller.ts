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
    const userEmail = await UserModel.findOne({ email });

    console.log(userEmail);

    // check if user exists
    if (userEmail) {
      return res.status(401).json({ message: "Email exists already" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const user = new UserModel({
      email: email,
      firstName: firstName,
      dateOfBirth: dateOfBirth,
      lastName: lastName,
      password: hashedPassword,
      mobileNumber: mobileNumber,
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





// import express, { Request, Response } from "express";
// import * as otpGenerator from "otp-generator";
// import * as Nexmo from "nexmo";

// const router = express.Router();

// // create a new instance of the Nexmo client with your API key and secret
// const nexmo = new Nexmo({
//   apiKey: process.env.NEXMO_API_KEY!,
//   apiSecret: process.env.NEXMO_API_SECRET!,
// });

// // endpoint to send an OTP to the user's mobile number
// router.post("/send-otp", async (req: Request, res: Response) => {
//   try {
//     const { mobileNumber } = req.body;

//     // generate a new OTP using the otp-generator package
//     const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

//     // send the OTP to the user's mobile number using the Nexmo client
//     nexmo.message.sendSms(
//       process.env.NEXMO_PHONE_NUMBER!,
//       mobileNumber,
//       `Your OTP is ${otp}.`,
//       (err: Error, responseData: any) => {
//         if (err) {
//           console.log(err);
//           res.status(500).json({ message: "Failed to send OTP." });
//         } else {
//           console.log(responseData);
//           res.json({ message: "OTP sent successfully." });
//         }
//       }
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to send OTP." });
//   }
// });

// // endpoint to verify the OTP sent to the user's mobile number
// router.post("/verify-otp", async (req: Request, res: Response) => {
//   try {
//     const { mobileNumber, otp } = req.body;

//     // verify the OTP entered by the user
//     if (otp === process.env.TEST_OTP) { // replace with your own OTP verification logic
//       res.json({ message: "OTP verified successfully." });
//     } else {
//       res.status(400).json({ message: "Invalid OTP." });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to verify OTP." });
//   }
// });

// export default router;
