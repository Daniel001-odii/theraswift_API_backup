import { Document, Types } from "mongoose";
import { Request } from "express";
import { PrescriptionType } from "../models/Prescription.model";

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
  strength: string;
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
  category?: string;
  image_url?: string;
}

export interface JwtPayload {
  email: string;
  mobile: string;
  userId: string;
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
  prescriptionId?: string;
  refill_request_id?: string;
  payment: {
    provider: "paystack" | "flutterwave" | "stripe" | "medwallet";
    transaction_id?: string;
    amount: number;
  };
  shipping_address: string;
  status: "pending" | "cancelled" | "dispensed" | "delivered" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
  orderId: string;
  prescriptionCompleted: boolean;
  delivery_time_chosen: string;
}

export interface IShippingAddress extends Document {
  userId: String;
  street_address: String;
  street_number: String;
  delivery_instruction: String;
  leave_with_doorman: String;
  lga: String;
  shipping_address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Prescription extends Document {
  // userId: Types.ObjectId;
  userId: String;
  type: PrescriptionType;
  name: string;
  strength: string;
  frequency: string;
  startDate: Date;
  prescriptionImageUrl: String;
  endDate: Date;
  doctor?: {
    name: string;
    phone: string;
    address: string;
  };
  pharmacy?: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface IPasswordResetToken extends Document {
  token: string;
  userId?: string;
  email: string;
  mobileNumber: string;
  tokenExpirationTime: Date;
  otpExpirationTime: Date;
  otp: String;
}

export interface IFamily {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  mobileNumber: string;
  gender: string;
}

export interface IHMO {
  userId: String;
  HmoName: String;
  front_insurance_image: String;
  back_insurance_image: String;
}

export interface IMessage {
  from: string;
  to: string;
  text: string;
  createdAt: Date;
}

export interface ICareerOpening extends Document {
  position: string;
  location: string;
  description: string;
  requirements: string;
  contactEmail: string;
}

export interface IUsersWeDontDeliverTo extends Document {
  email: string;
  address: string;
  state: string;
}