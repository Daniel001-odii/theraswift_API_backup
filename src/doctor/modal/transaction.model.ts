import { Schema, model } from "mongoose";
import { ITransaction } from "../interface/transaction.interface";

const TransactionSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["success", "pending", "declined"],
        required: true,
      },
      transactionType: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      customerId: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      
    },
    {
      timestamps: true,
    }
  );
  
  const TransactionMoel = model<ITransaction>("Transaction", TransactionSchema);
  
  export default TransactionMoel;