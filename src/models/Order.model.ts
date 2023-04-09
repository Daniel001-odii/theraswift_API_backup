import { truncate } from "fs/promises";
import { Schema, model } from "mongoose";
import { IOrder } from "../interface/generalInterface";

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderId:{
      type:String,
      required:true,
      unique:true
    },
    type:{
      type: String,
      required:true,
    },
    products: [
      {
        medication_id: {
          type: Schema.Types.ObjectId,
          ref: "Medications",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    prescription: {
      type: Schema.Types.ObjectId,
      ref: "Prescription",
    },
    refill_request_id: {
      type: Schema.Types.ObjectId,
      ref: "RefillRequest",
    },
    payment: {
      type: {
        provider: {
          type: String,
          enum: ["paystack", "flutterwave", "stripe"],
          required: true,
        },
        transaction_id: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    shipping_address: {
      type: String,
      required: true,
    },
    deliver_time:{
      type:String
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "dispensed", "delivered","rejected"],
      default: "pending",
    },
    prescriptionCompleted:{
      type:Boolean,
      default: true
    },
    dispenseInfo:{
      
    }
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>("Order", orderSchema);

export default Order;
