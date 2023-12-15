import { Schema, model } from "mongoose";
import { IEssentialCart } from "../interface/ensentialCart.interface";

const EnsentialCartSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      productId: {
        type: Schema.Types.ObjectId, ref: 'EssentialProduct',
        required: true,
      },
      quantityrquired: {
        type: Number,
        required: true,
      },
      refill: {
        type: String,
        default: "no",
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
  
  const EnsentialCartModel = model<IEssentialCart>("EnsentialCart", EnsentialCartSchema);
  
  export default EnsentialCartModel;