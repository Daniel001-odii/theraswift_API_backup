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
      required:false,
    },
    products: [
      {
        medication: {
          type: Schema.Types.ObjectId,
          ref: "Medications",
          required: false,
        },
        medicationForm: String,
        medicationStrength: String,
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    prescriptionId: {
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
          enum: ["paystack", "flutterwave", "stripe",'medwallet'],
          required: true,
        },
        transaction_id: {
          type: String,
          required: false,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    shipping_address: {
      type: {},
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
    // dispenseInfo:{
      
    // }
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>("Order", orderSchema);

export default Order;
