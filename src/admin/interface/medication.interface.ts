import { Document, Types, ObjectId } from "mongoose";

export interface IMedication extends Document {
  _id: ObjectId;
  name: string;
  description?: string;
  price: string;
  strength: string;
  quantity: string;
  medicationImage: string;
  prescriptionRequired: boolean;
  form: string;
  ingredient: string;
  medInfo: string;
  createdAt: Date;
  updatedAt: Date;
}