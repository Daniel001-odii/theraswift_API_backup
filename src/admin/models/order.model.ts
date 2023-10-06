import { Schema, model } from "mongoose";
import { MedicationDocument, IOrder } from "../interface/order.interface";


const medicationSchema = new Schema<MedicationDocument>({
    meidcationId: String,
    name: String,
    form: String,
    dosage: String,
    quantity: String,
    price: String,
    orderQuantity: Number,
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
      medications: [medicationSchema],
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
        enum: ["delivered", "not delivered"],
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