import { Schema, model } from "mongoose";
import { IOrder } from "../interface/generalInterface";

const orderSchema = new Schema({
  userIid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  prescription: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription',
  },
  refill_request_id: {
    type: Schema.Types.ObjectId,
    ref: 'RefillRequest',
  },
  payment: {
    type: {
      provider: {
        type: String,
        enum: ['paystack', 'flutterwave', 'stripe'],
        required: true,
      },
      transaction_id: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  shipping_address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-transit', 'delivered'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Order = model<IOrder>('Order', orderSchema);

export default Order;
