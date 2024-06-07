import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    email: string;
    _id: string;
}

interface CustomRequest extends Request {
    jwtPayload?: JwtPayload;
    user: any;
}

export const verifyToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {

    let secret = process.env.JWT_User_SECRET_KEY;
  // Get JWT from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify JWT and extract payload
    jwt.verify(token, secret!) as unknown as JwtPayload;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid authorization token" });
  }
}