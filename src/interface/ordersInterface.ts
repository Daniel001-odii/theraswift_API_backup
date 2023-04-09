import { Types } from "mongoose";
import { PrescriptionType } from "../models/Prescription.model";

interface OrderProduct {
  medication_id: Types.ObjectId;
  quantity: number;
}

interface OrderPayment {
  provider: "paystack" | "flutterwave" | "stripe";
  transaction_id: string;
  amount: number;
}

export interface AddOrderRequestBody {
  userId: string;
  products: OrderProduct[];
  prescription_id?: Types.ObjectId;
  delivery_time_chosen:string;
  prescription_input?: {
    type: PrescriptionType;
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate: Date;
    doctor?: string;
    pharmacy?: string;
  };
  refill_request_id?: Types.ObjectId;
  payment: OrderPayment;
  shipping_address: string;
  order_type:string;
  orderId:string,
  prescriptionCompleted:boolean
}

export interface AddPrescriptionRequest {
  userId: string;
  type?: PrescriptionType;
  name?: string;
  dosage?: string;
  frequency?: string;
  startDate?: Date;
  endDate?: Date;
  doctor?: Object;
  pharmacy?: Object;
}
