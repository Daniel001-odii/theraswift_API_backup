import { Schema, model } from "mongoose";
import { MedicationDocument, IOrder } from "../interface/orderFromDoctor.interface";


const medicationSchema = new Schema<MedicationDocument>({
    meidcationId: String,
    name: String,
    form: String,
    strength: String,
    quantity: String,
    price: String,
    orderQuantity: Number,
    dosage: String,
    frequency: Number,
    route: String,
    duration: String,
});


const OrderSchema = new Schema(
    {
      patientId: {
        type: Schema.Types.ObjectId, ref: 'PatientReg',
        required: true,
      },
      doctortId: {
        type: Schema.Types.ObjectId, ref: 'DoctorReg',
        required: true,
      },
      clinicCode: {
        type: String,
        required: true,
      },
      paymentId: {
        type: String,
      },
      medications: [medicationSchema],
      deliveryDate: {
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
      methodOfPaymen: {
        type: String,
        enum: ["HMO", "pocket"],
        required: true,
      },
      hmoName: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "delivered"],
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
  
  const OrderFormDoctorModel = model<IOrder>("OrderFromDoctor", OrderSchema);
  
  export default OrderFormDoctorModel;