import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";


export interface IPatientMedicationImage extends Document {
    _id: ObjectId;
    userId: IUserReg['_id'];
    patientMedicationImage: string;
    enter: string;
    createdAt: Date;
    updatedAt: Date;
    
  }