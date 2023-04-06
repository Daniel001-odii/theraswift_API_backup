import TransactionsModel from "../models/Transactions.model";
import { Request, Response, NextFunction } from "express";

export const getUserTransactions = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    let data = await TransactionsModel.find({ userId });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error)
  }
};
