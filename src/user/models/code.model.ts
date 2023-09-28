import { Schema, model } from "mongoose";
import { ICode } from "../interface/reg.interface";

const CodeSchema = new Schema(
    {
      code: {
        type: Number,
        default: 100000,
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
  
  const CodeModel = model<ICode>("RefererCodeGenerator", CodeSchema);
  
  export default CodeModel;