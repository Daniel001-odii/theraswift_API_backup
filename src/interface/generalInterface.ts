import { Document, Types, ObjectId } from "mongoose";
import { Request } from "express";
import { PrescriptionType } from "../models/Prescription.model";

export interface IUser extends Document {
  _id: ObjectId;
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
  userMedications: [string];
  theraWallet: Number;
}

export interface IDispenseLog extends Document {
  userId: string;
  fullName: string;
  prescriber: string;
  dispenser: string;
  dosage: string;
  dateOfBirth: string;
  dateDispensed: string;
  email: string;
  orderId: string;
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
  quantity?: string;
}

export interface JwtPayload {
  email: string;
  mobileNumber: string;
  userId: string;
  _id: string;
}

export interface CustomRequest extends Request {
  jwtPayload?: JwtPayload;
}

export interface IOrder extends Document {
  userId: string;
  type: string;
  products: {
    medication: string;
    quantity: number;
    medicationForm: String;
    medicationStrength: String;
  }[];
  prescriptionId?: string;
  refillRequestId?: string;
  payment: {
    provider: "paystack" | "flutterwave" | "stripe" | "medwallet";
    transactionId?: string;
    amount: number;
  };
  shippingAddress: string;
  status: "pending" | "cancelled" | "dispensed" | "delivered" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
  orderId: string;
  prescriptionCompleted: boolean;
  deliveryTime: string;
  profile_info: {
    allergy: {
      hasAllergy: Boolean,
      information: String
    }
    medCondition: {
      hasMedCondition: Boolean,
      information: String
    }
    otherMedCondition: {
      hasOtherMedication: Boolean,
      information: String
    }
  }
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

export interface IBeneficiaryAdded extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  beneficiaryUserId: string;
}

export interface Prescription extends Document {
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
