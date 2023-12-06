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
      uses: {
        type: String,
      },
      quantity: {
        type: String,
      },
      medicationImage: {
        type: String,
      },
      inventoryQauntity:{
        type: String,
      },
      ingredient: {
        type: String,
      },
      expiryDate: {
        type: String,
        default: "",
      },
      category: {
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