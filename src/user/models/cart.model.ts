import { Schema, model } from "mongoose";
import { ICart } from "../interface/cart.interface";

const CartSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      medicationId: {
        type: Schema.Types.ObjectId, ref: 'Medication',
        required: true,
      },
      userMedicationId: {
        type: Schema.Types.ObjectId, ref: 'UserMedication',
        required: true,
      },
      quantityrquired: {
        type: Number,
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