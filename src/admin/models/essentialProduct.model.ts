import { Schema, model } from "mongoose";
import { IEssestialProduct } from "../interface/essentialProduct.interface";

const EssentialProductSchema = new Schema(
    {
      categoryId: {
        type: Schema.Types.ObjectId, ref: 'EssentialCategory',
        required: true,
      },
      name: {
        type: String,
      },
      price: {
        type: String,
      },
      strength: {
        type: String,
      },
      quantity: {
        type: String,
      },
      medicationImage: {
        type: String,
      },
      form:{
        type: String,
      },
      ingredient: {
        type: String,
      },
      medInfo: {
        type: String,
        default: "",
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
  
  const EssentialProductModel = model<IEssestialProduct>("EssentialProduct", EssentialProductSchema);
  
  export default EssentialProductModel;