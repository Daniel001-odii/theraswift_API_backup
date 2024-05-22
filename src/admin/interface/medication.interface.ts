import { Document, Types, ObjectId } from "mongoose";

export interface IMedication extends Document {
  _id: ObjectId;
  name: string;
  price: number;

  quantity: string;
  medicationImage: string;
  prescriptionRequired: string;
  form: string;
  ingredient: string;
  quantityForUser: string;
  inventoryQuantity: string;
  expiredDate: Date;
  category: string;

  medInfo: {
    overView: string;
    howToUse: string;
    sideEffect: string;
    storage: string;
    drugInteraction: string;
    overdose: string;
    more: string;
  };

  createdAt: Date;
  updatedAt: Date;
}