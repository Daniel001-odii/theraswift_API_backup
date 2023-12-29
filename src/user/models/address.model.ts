import { Schema, model } from "mongoose";
import { IAddress } from "../interface/address.interface";

const AddressSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      streetAddress: {
        type: String,
        required: true,
      },
      streetNO: {
        type: String,
        required: true,
      },
      LGA: {
        type: String,
        required: true,
      },
      DeliveryInstruction: {
        type: String,
        required: true,
      },
      doorMan: {
        type: Boolean,
        default: false
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
  
  const UserAddressModel = model<IAddress>("UserAddress", AddressSchema);
  
  export default UserAddressModel;