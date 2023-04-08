import { Schema, model } from "mongoose";
import { IHMO } from "../interface/generalInterface";

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    HmoName: {
      type: String
    },
   
    front_insurance_image: {
      type: String,
    },
    back_insurance_image: {
      type: String,
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

const HMOModel = model<IHMO>("HMO", UserSchema);

export default HMOModel;
