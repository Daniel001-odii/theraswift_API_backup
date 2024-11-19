import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg } from "./reg_interface";

export interface IDoctorWallet extends Document {
    _id: ObjectId; 
    amount: number;
    clinicCode: string;
    doctorId: IDoctorReg['_id'];
    funds_payout: {
        account_number: string,
        bank_code: string,
        recipient_code: string,
      },
    createdAt: Date;
    updatedAt: Date;
}