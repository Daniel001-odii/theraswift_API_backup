import { Schema, model } from "mongoose";
import { ICart } from "../interface/cart.interface";

const CartSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      medicationId: {
        type: String,
      },
      userMedicationId: {
        type: String,    
      },
      productId: {
        type: String,
      },
      quantityrquired: {
        type: Number,
        required: true,
      },
      refill: {
        type: String,
        default: "no",
      },
      type: {
        type: String,
        enum: ["med", "ess"],
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
  
  const CartModel = model<ICart>("Cart", CartSchema);
  
  export default CartModel;