import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg, IPatientReg } from "./reg_interface";

export interface IPatientPrescription extends Document {
    _id: ObjectId;
    drugName: string;
    dosage: string;
    dosageForm: string;
    frequency: number;
    route: string;
    duration: string;
    status: string;
    processingStatus: string;
    doctorId: IDoctorReg['_id'];
    patientId: IPatientReg['_id']
    createdAt: Date;
    updatedAt: Date;
  }