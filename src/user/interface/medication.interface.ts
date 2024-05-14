import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";
import { IMedication } from "../../admin/interface/medication.interface";

export interface IUserMedication extends Document {
  _id: ObjectId;
  userId: IUserReg['_id'];
  medicationId: IMedication['_id'];
  prescriptionStatus: boolean;
  prescriptionImage: string;
  doctor: ObjectId;
  clinicCode: string;
  createdAt: Date;
  updatedAt: Date;
  
}