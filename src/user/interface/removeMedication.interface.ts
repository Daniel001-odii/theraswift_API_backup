import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";
import { IMedication } from "../../admin/interface/medication.interface";


export interface IRemoveMedication extends Document {
    _id: ObjectId;
    userId: IUserReg['_id'];
    medicationId: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date; 
}