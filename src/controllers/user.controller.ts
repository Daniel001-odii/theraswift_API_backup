import { Request, Response } from "express";
import User from "../models/User.model";

export const getUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
