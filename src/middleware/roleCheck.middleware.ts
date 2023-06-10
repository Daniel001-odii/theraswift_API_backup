import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.model";
import { JwtPayload, CustomRequest } from "../interface/generalInterface";





export const checkAdminRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let secret = process.env.JWT_SECRET_KEY;
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
    const user = await UserModel.findOne({
      email: payload.email,
      mobile: payload.mobile,
      role: "admin",
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    // Add the payload to the request object for later use
    req.jwtPayload = payload;

    // Call the next middleware function
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid authorization token" });
  }
};




export const checkRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let secret = process.env.JWT_SECRET_KEY;
  // Get JWT from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify JWT and extract payload
    const payload = jwt.verify(token, secret!) as unknown as JwtPayload;

    // Check if email and mobile are in the MongoDB and belong to an admin or user role
    const user = await UserModel.findOne({
      email: payload.email,
      mobile: payload.mobile,
      role: { $in: ["admin", "user"] },
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    // Add the payload to the request object for later use
    req.jwtPayload = payload;

    // Call the next middleware function
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid authorization token" });
  }
};
