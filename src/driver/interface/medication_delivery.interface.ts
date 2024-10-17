import { Document, Types, ObjectId } from "mongoose";
import { IDriverReg } from "./reg.interface";

export interface MedicationDeliveryInterface extends Document {
  _id: ObjectId;
  patient: string;
  medicationId: string;
  amount: Number,
  address: String,
  driverId: IDriverReg['_id'],
  deliveryStatus: string,
  prescriber: String,
//   deliveredImage: string;
}