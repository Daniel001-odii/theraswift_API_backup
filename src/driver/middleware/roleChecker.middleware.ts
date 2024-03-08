import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import DRiverModel from "../model/reg.model";
import DriverModel from "../model/reg.model";

interface JwtPayload {
    email: string;
    _id: string;
}

interface CustomRequest extends Request {
    jwtPayload?: JwtPayload;
    driver: any;
}

export const checkDriverRole = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {

    let secret = process.env.JWT_Driver_SECRET_KEY;
  // Get JWT from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify JWT and extract payload
    const payload = jwt.verify(token, secret!) as unknown as JwtPayload;
   
    // Check if email and mobile are in the MongoDB and belong to an admin role
    const driver = await DriverModel.findOne({
      email: payload.email
    });

    if (!driver) {
      return res
        .status(403)
        .json({ message: "Access denied. driver role required." });
    }

    // Add the payload to the request object for later use
    req.driver = payload;
    
    // Call the next middleware function
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid authorization token" });
  }
}