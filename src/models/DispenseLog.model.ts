import { Schema, model } from "mongoose";
import { IDispenseLog } from "../interface/generalInterface";

const DispenseLogSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userId:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    dosage: {
      type: String,
    },
    dateOfBirth: String,
    dispenser: {
      type: String,
      required: true,
    },
    prescriber: {
      type: String,
      required: true,
    },
    dateDispensed: String,
    orderId: String,
  },
  {
    timestamps: true,
  }
);

const DispenseLogModel = model<IDispenseLog>("User", DispenseLogSchema);

export default DispenseLogModel;
