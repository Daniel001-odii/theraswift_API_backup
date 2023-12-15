import { Document, Types, ObjectId } from "mongoose";
import { IUserReg } from "./reg.interface";
import { IEssestialProduct } from "../../admin/interface/essentialProduct.interface";

export interface IEssentialCart extends Document {
    _id: ObjectId;
    userId: IUserReg['_id'];
    productId: IEssestialProduct['_id'];
    quantityrquired: number;
    refill: string;
    createdAt: Date;
    updatedAt: Date; 
}