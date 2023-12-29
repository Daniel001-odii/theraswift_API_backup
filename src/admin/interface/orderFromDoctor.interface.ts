import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg, IPatientReg } from "../../doctor/interface/reg_interface";


interface Medication {
    medication: any;
    orderQuantity: number;
    dosage: string;
    frequency: number;
    route: string;
    duration: string;
}

export interface MedicationDocument extends Medication, Document {}

export interface IOrder extends Document {
  _id: ObjectId;
  patientId: IPatientReg['_id'];
  doctortId: IDoctorReg['_id'];
  clinicCode: string,
  paymentId: string;
  medications: MedicationDocument[];
  deliveryDate: string;
  totalAmount: string;
  amountPaid: string;
  paymentDate: string;
  methodOfPayment: string;
  hmoName: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}