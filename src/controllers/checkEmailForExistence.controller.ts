import UserModel from "../models/User.model";
import { Request, Response } from "express";

export const checkEmailForExistenceController = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      return res
        .status(200)
        .json({
          message: "User exists with the provided email.",
          existingUser: true,
        });
    } else {
      return res
        .status(200)
        .json({
          message: "No user exists with the provided email.",
          existingUser: false,
        });
    }
  } catch (error) {
    console.error("Error checking user by email:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
