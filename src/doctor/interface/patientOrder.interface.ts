import { Document, Types, ObjectId } from "mongoose";
import { IPatientPrescription } from "../interface/prescription.interface";
import { IDoctorReg, IPatientReg } from "./reg_interface";

export interface IPatientOrder extends Document {
    _id: ObjectId;
    patientPrescriptionId: IPatientPrescription['_id'];
    patientId: IPatientReg['_id'];
    hmoId: string;
    clinicCode: string;
    patientPayment: number;
    hmoPayment: number;
    status: string;
    toHmo: string;
    hmoState: string;
    createdAt: Date;
    updatedAt: Date;
  }