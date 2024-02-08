import { Schema, model } from "mongoose";
import { IHmoAccount } from "../interface/hmoAccount.interface";

const HmoAccountSchema = new Schema(
    {
      amount: {
        type: Number,
        default: 0,
      },
      doctorId:{
        type: Schema.Types.ObjectId, ref: 'DoctorReg'
      },
      clinicCode: {
        type: String,
      },
      patientId: {
        type: String,
      },
      medicationId: {
        type: String,
      },
      status: {
        type: String,
        enum: ["cleared", "not cleared"]
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
  
  const HmoAccountModel = model<IHmoAccount>("HmoAccount", HmoAccountSchema);
  
  export default HmoAccountModel;