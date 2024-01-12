import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "../../user/interface/reg.interface";


interface Medication {
    medication: any;
    orderQuantity: number;
    refill: string;
}

interface EssentialProduct {
  product: any
  orderQuantity: number;
  refill: string;
}

export interface MedicationDocument extends Medication, Document {}

export interface EssentialDocument extends EssentialProduct, Document {}

export interface IOrder extends Document {
  _id: ObjectId;
  userId: IUserReg['_id'];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  paymentId: string;
  medications?: MedicationDocument[];
  ensential?: EssentialDocument[];
  deliveryDate: string;
  refererBunousUsed: string;
  totalAmount: string;
  amountPaid: string;
  paymentDate: string;
  deliveredStatus: string;
  createdAt: Date;
  updatedAt: Date;
}