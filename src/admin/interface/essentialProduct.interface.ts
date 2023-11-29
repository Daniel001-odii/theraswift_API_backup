import { Document, Types, ObjectId } from "mongoose";
import { IEssentailCategory } from "./essentialCategory.interface";

export interface IEssestialProduct extends Document {
  _id: ObjectId;
  categoryId: IEssentailCategory['_id'];
  name: string;
  price: string;
  strength: string;
  quantity: string;
  medicationImage: string;
  form: string;
  ingredient: string;
  medInfo: string;
  createdAt: Date;
  updatedAt: Date;
}