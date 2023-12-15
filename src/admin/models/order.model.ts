import { Schema, model } from "mongoose";
import { MedicationDocument, EssentialDocument, IOrder } from "../interface/order.interface";


const medicationSchema = new Schema<MedicationDocument>({
    meidcationId: String,
    name: String,
    form: String,
    dosage: String,
    quantity: String,
    price: String,
    orderQuantity: Number,
    refill: String
});

const EnsentailSchema = new Schema<EssentialDocument>({
  productId: String,
  name: String,
  quantity: String,
  price: String,
  orderQuantity: Number,
  refill: String,
});


const OrderSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      paymentId: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      dateOfBirth: {
        type: String,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
      },
      address: {
        type: String,
      },
      medications: [medicationSchema],
      ensential: [EnsentailSchema],
      deliveryDate: {
        type: String,
      },
      refererBunousUsed: {
        type: String,
      },
      totalAmount: {
        type: String,
      },
      amountPaid: {
        type: String,
      },
      paymentDate:{
        type: String,
      },
      deliveredStatus: {
        type: String,
        enum: ["delivered", "pending", "not delivered"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    
    },
    {
      timestamps: true,
    }
  );
  
  const OrderModel = model<IOrder>("Order", OrderSchema);
  
  export default OrderModel;