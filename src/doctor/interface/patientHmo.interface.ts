import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg, IPatientReg } from "./reg_interface";

export interface IPatientHmo extends Document {
    _id: ObjectId;
    firstName: string;
    surname: string;
    phoneNumber: string;
    EnroleNumber: number;
    email: string;
    address: string;
    medicalCode: string;
    medicalRecord: string;
    status: string;
    doctorId: IDoctorReg['_id'];
    patientId: IPatientReg['_id']
    hmoID: IDoctorReg['_id'];
    createdAt: Date;
    updatedAt: Date;
  }