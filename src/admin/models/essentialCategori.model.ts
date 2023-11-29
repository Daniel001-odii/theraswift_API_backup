import { Schema, model } from "mongoose";
import { IEssentailCategory } from "../interface/essentialCategory.interface";

const EssentialCategorySchema = new Schema(
    {
      name: {
        type: String,
      },
      img: {
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
  
  const EssentialCategoryModel = model<IEssentailCategory>("EssentialCategory", EssentialCategorySchema);
  
  export default EssentialCategoryModel;