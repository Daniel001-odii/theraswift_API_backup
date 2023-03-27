import { ExpressArgs } from "../types/generalTypes";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// login users
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // try find user with email
    const user = await UserModel.findOne({ email });

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
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    // return access token
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    // login error
    next?.(err);
  }
};

export default login;
