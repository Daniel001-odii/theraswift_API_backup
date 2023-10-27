import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg } from "./reg_interface";

export interface IDoctorWallet extends Document {
    _id: ObjectId; 
    amount: number;
    doctorId: IDoctorReg['_id'];
    createdAt: Date;
    updatedAt: Date;
}