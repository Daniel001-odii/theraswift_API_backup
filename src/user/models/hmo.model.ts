import { Schema, model } from "mongoose";
import { IHmo } from "../interface/hmo.interface";

const HmoSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      hmoImage: {
        type: String,
        default: "",
      },
      enrolNumber: {
        type: String,
        default: "",
      },
      enrolName: {
        type: String,
        default: "",
      },
      provider: {
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
  
  const UserHmoModel = model<IHmo>("UserHmo", HmoSchema);
  
  export default UserHmoModel;