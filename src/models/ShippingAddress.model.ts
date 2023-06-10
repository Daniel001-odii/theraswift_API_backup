import { Schema, model } from "mongoose";
import { IShippingAddress } from "../interface/generalInterface";

const shippingAddressSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    street_address: {
      type: String,
      required: true,
    },
    street_number: {
      type: String,
      required: false,
    },
    delivery_instruction: {
      type: String,
      required: false,
    },
    leave_with_doorman: {
      type: String,
      required: false,
    },
    lga: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const shippingAddressModel = model<IShippingAddress>(
  "Shipping_address",
  shippingAddressSchema
);

export default shippingAddressModel;
