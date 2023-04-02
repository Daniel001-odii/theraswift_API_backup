import { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  mobileNumber: string;
  gender: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  // verified: boolean;
  mobileOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  theraWallet: Number;
}

export interface ITransaction extends Document {
  userId: string;
  type:
    | "gift-balance"
    | "product-order"
    | "wallet-topup"
    | "order-refill"
    | "non-prescription-order"
    | "prescription-order";
  details: {
    sender?: string;
    recipient?: string;
    orderId?: string;
    medication_name?: string;
    quantity?: number;
    prescription_required?: boolean;
    payment_method?: string;
    transaction_id?: string;
    amount_paid?: number;
    currency?: string;
    payment_status?: string;
    prescription?: Object;
    product_order_type?:
      | "order-refill"
      | "non-prescription-order"
      | "prescription-order";
    // [key: string]: string | undefined;
  };
  amount: number;
  created_at: Date;
}

export interface IMedication extends Document {
  name: string;
  description: string;
  dosage: string;
  warnings?: string;
  manufacturer?: string;
  price?: number;
  available?: boolean;
  // expiryDate?: Date;
  sideEffects?: string[];
  ingredients?: string[];
  storageInstructions?: string;
  contraindications?: string[];
  routeOfAdministration?: string;
  prescription_required: boolean;
}

export interface JwtPayload {
  email: string;
  mobile: string;
}

export interface CustomRequest extends Request {
  jwtPayload?: JwtPayload;
}

export interface IOrder extends Document {
  userId: string;
  type: string;
  products: {
    medication_id: string;
    quantity: number;
  }[];
  prescription?: string;
  refill_request_id?: string;
  payment: {
    provider: "paystack" | "flutterwave" | "stripe";
    transaction_id: string;
    amount: number;
  };
  shipping_address: string;
  status: "pending" | "cancelled" | "dispensed" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}
