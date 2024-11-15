import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg, IPatientReg } from "./reg_interface";
import { IMedication } from "../../admin/interface/medication.interface";

export interface IPatientPrescription extends Document {
  _id: ObjectId;
  dosage: string;
  frequency: number;
  route: string;
  duration: string;
  status: string;
  doctorId: IDoctorReg['_id'];
  patientId: IPatientReg['_id'];
  medications: [IMedication['_id']];
  medicationId: IMedication['_id'],
  clinicCode: string;
  createdAt: Date;
  updatedAt: Date;
}