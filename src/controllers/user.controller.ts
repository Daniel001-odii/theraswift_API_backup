import { Request, Response, Router } from "express";
import User from "../models/User.model";

const router: Router = Router();

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default router;
