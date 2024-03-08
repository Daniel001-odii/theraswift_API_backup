import { Document, Types, ObjectId } from "mongoose";
import { IDriverReg } from "./reg.interface";

export interface IDeliver extends Document {
  _id: ObjectId;
  driverId: IDriverReg['_id'];
  userId: string;
  orderId: string;
  enoughFuel: string;
  phoneCharge: string;
  theraswitId: string;
  deliveredStatus: string;
  deliveredImage: string;
  createdAt: Date;
  updatedAt: Date;
}