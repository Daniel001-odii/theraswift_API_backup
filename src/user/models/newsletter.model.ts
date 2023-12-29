import { Schema, model } from "mongoose";
import { INewaletter } from "../interface/newsletter.interface";

const NewsletterSchema = new Schema(
    {  
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
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
  
  const NewsletterModel = model<INewaletter>("Newsletter", NewsletterSchema);
  
  export default NewsletterModel;