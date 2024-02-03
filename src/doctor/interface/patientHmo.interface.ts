import { Document, Types, ObjectId } from "mongoose";
import { IDoctorReg, IPatientReg } from "./reg_interface";
import { IOrder } from "../../admin/interface/orderFromDoctor.interface";



export interface IPatientHmo extends Document {
    _id: ObjectId;
    firstName: string;
    surname: string;
    phoneNumber: string;
    EnroleNumber: number;
    email: string;
    address: string;
    medicalRecord: string;
    status: string;
    patientId: IPatientReg['_id']
    doctorClinicCode: string;
    icdCode: string;
    hmoClinicCode: string;
    createdAt: Date;
    updatedAt: Date;
  }