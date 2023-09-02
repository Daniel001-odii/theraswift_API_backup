import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AdminModel from "../models/admin_reg.model";


//admin signin /////////////
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
  
      // generate access token
      const accessToken = jwt.sign(
        { 
          id: admin?._id,
          email: admin.email,
        },
        process.env.JWT_ADMIN_SECRET_KEY!,
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