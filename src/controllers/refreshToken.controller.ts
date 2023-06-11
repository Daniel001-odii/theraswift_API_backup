import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.model";
import { JwtPayload, CustomRequest } from "../interface/generalInterface";

// refresh token verification route controller
export const refreshTokenVerification = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {

  let secret = process.env.REFRESH_JWT_SECRET_KEY;
  // Get JWT from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];


  if (!token) {
    return res.status(401).json({ message: "Authorization refresh token missing" });
  }
 
  const payload = jwt.verify(token!, secret!) as unknown as JwtPayload;

  // Check if email and mobile are in the MongoDB
  const user = await UserModel.findOne({
    email: payload.email,
    mobile: payload.mobile,
    role: { $in: ["admin", "user"] },
  });

  const accessToken = jwt.sign(
    {
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role,
    },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "1h" }
  );

  res.json({
    message: "AccessToken regeneration  successful",
    accessToken,
  });
};

// export default refreshTokenVerification;
