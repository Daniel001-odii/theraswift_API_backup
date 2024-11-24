import { Document, ObjectId } from "mongoose";
import { IDoctorReg, IPatientReg } from "./reg_interface";

export interface IMedicationDetails {
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
}

export interface IPatientPrescription extends Document {
  _id: ObjectId;
  status: "delivered" | "pending";
  doctorId: IDoctorReg["_id"];
  patientId: IPatientReg["_id"];
  medications: IMedicationDetails[]; // Array of objects with medication details
  clinicCode: string;
  createdAt: Date;
  updatedAt: Date;
}
