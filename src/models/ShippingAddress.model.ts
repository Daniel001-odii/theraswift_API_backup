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
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

const shippingAddressModel = model<IShippingAddress>("Shipping_address", shippingAddressSchema);

export default shippingAddressModel;
