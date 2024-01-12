import { Schema, model } from "mongoose";
import { IDoctorWallet } from "../interface/doctorWallet.interface";

const DoctorWalletSchema = new Schema(
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
  
  const DoctorWalletModel = model<IDoctorWallet>("DoctorWallet", DoctorWalletSchema);
  
  export default DoctorWalletModel;