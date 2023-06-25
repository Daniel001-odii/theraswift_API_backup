import { Schema, model } from "mongoose";
import { ITransaction } from "../interface/generalInterface";

const TransactionSchema = new Schema(
  {
        userId: String,
        type: {
          type: String,
          enum: ['gift-balance', 'product-order', 'wallet-topup','medication-order']
        },
        details: Object,
        amount: {
          type: Number,
          required: true
        },
        created_at: {
          type: Date,
          default: Date.now()
        }
  },
  {
    timestamps: true,
  }
);

const TransactionsModel = model<ITransaction>("Transactions", TransactionSchema);

export default TransactionsModel;
