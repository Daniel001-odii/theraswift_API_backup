import { Request, Response } from "express";
import UserModel from "../models/User.model";




export const WalletBalanceController = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
  
      if (!userId) return res.json({ message: "please pass user id" });
  
      let user = await UserModel.findOne({ userId });
  
      res.status(201).json({
        theraWalletBalance: user!.theraWallet,
      });
    } catch (err: any) {
      throw err.message;
    }
  };