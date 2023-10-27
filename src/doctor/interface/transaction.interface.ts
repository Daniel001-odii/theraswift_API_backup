import { Document, Types, ObjectId } from "mongoose";

export interface ITransaction extends Document {
    _id: ObjectId;
    name: string;
    status: string;
    transactionType: string;
    amount: number;
    customerId: string;
    createdAt: Date;
    updatedAt: Date;
  }