import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";
import { IMedication } from "../../admin/interface/medication.interface";
import { IUserMedication } from "./medication.interface";

export interface ICart extends Document {
    _id: ObjectId;
    userId: IUserReg['_id'];
    medicationId: string;
    userMedicationId: string;
    productId: string;
    quantityrquired: number;
    refill: string;
    type: string;
    createdAt: Date;
    updatedAt: Date; 
}