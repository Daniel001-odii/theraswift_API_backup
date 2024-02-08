import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg } from "./reg_interface";

export interface IHmoAccount extends Document {
    _id: ObjectId; 
    amount: number;
    clinicCode: string;
    doctorId: IDoctorReg['_id'];
    patientId: string;
    medicationId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}