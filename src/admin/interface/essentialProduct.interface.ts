import { Document, Types, ObjectId } from "mongoose";
import { IEssentailCategory } from "./essentialCategory.interface";

export interface IEssestialProduct extends Document {
  _id: ObjectId;
  categoryId: IEssentailCategory['_id'];
  name: string;
  price: string;
  uses: string;
  quantity: string;
  medicationImage: string;
  inventoryQauntity: string;
  ingredient: string;
  expiryDate: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}