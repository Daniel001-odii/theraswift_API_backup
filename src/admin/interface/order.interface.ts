import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "../../user/interface/reg.interface";


interface Medication {
    meidcationId: string;
    name: string;
    form: string;
    dosage: string;
    quantity: string;
    price: string;
    orderQuantity: number;
}

export interface MedicationDocument extends Medication, Document {}

export interface IOrder extends Document {
  _id: ObjectId;
  userId: IUserReg['_id'];
  paymentId: string;
  medications: MedicationDocument[];
  deliveryDate: string;
  refererBunousUsed: string;
  totalAmount: string;
  amountPaid: string;
  paymentDate: string;
  deliveredStatus: string;
  createdAt: Date;
  updatedAt: Date;
}