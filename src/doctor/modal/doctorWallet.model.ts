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

      transactions: [{
        transaction_type: {
          type: String,
          enum: ["fund", "withdrawal"],
          reference: String,
        },
        transaction_date: {
          type: Date,
          default: Date.now,
        }
      }],

      
      // bank funds...
      funds_payout: {
        account_number: String,
        bank_code: String,
        recipient_code: String,
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