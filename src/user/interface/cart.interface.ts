import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";
import { IMedication } from "../../admin/interface/medication.interface";
import { IUserMedication } from "./medication.interface";

export interface ICart extends Document {
    _id: ObjectId;
    userId: IUserReg['_id'];
    medicationId: IMedication['_id'];
    userMedicationId: IUserMedication['_id'];
    quantityrquired: number;
    createdAt: Date;
    updatedAt: Date; 
}