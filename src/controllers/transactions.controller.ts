import TransactionsModel from "../models/Transactions.model";
import { Request, Response, NextFunction } from "express";

export const getUserTransactions = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    let data = await TransactionsModel.find({ userId });
    res.status(200).json({ data });
  } catch (error:any) {
    res.status(500).json({ message: "internal server error", error:error.message,});
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    let data = await TransactionsModel.find();
    res.status(200).json({ data });
  } catch (error:any) {
    res.status(500).json({ message: "internal server error", error:error.message,});
  }
};


export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let data = await TransactionsModel.findById(id);
    res.status(200).json({ data });
  } catch (error:any) {
    res.status(500).json({ message: "internal server error", error: error.message,});
  }
};
