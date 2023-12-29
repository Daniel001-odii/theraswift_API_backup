import { Schema, model } from "mongoose";
import { IFrequenceAsk } from "../interface/frequenceAskQuestion.interface";

const FrequenceAskSchema = new Schema(
    {
      question: {
        type: String,
      },
      answer: {
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
  
  const FrequenceAskModel = model<IFrequenceAsk>("FrequenceAsk", FrequenceAskSchema);
  
  export default FrequenceAskModel;