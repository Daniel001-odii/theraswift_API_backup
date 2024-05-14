import { Document, Types, ObjectId } from "mongoose";

export interface IAwaitingMedication extends Document {
  _id: ObjectId;
  patientId: ObjectId;
  email: string;
  phoneNumber: string;
  medicationId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}