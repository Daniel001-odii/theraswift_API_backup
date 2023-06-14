import { Schema, model } from "mongoose";
import { IFamily } from "../interface/generalInterface";

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
      lowercase: true,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    mobileNumber: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
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

const FamilyModel = model<IFamily>("Family", UserSchema);

export default FamilyModel;
