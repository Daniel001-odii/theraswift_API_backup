import { Schema, model } from "mongoose";
import { IPatientOrder } from "../interface/patientOrder.interface";

const PatientOrderSchema = new Schema(
    {
      patientPrescriptionId:{
        type: Schema.Types.ObjectId, ref: 'PatientPrescription'
      },
      patientId:{
        type: Schema.Types.ObjectId, ref: 'PatientReg'
      },
      clinicCode: {
        type: String,
      },
      patientPayment: {
        type: Number,
      },
      hmoPayment: {
        type: Number,
      },
      status: {
        type: String,
        enum: ["delivered", "pending", "progress"],
        required: true,
      },
      toHmo: {
        type: String,
        enum: ["yes", "no"],
        required: true,
      },
      hmoState: {
        type: String,
        enum: ["admin", "hmo", "final", ""],
        default: "",
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
  
  const PatientOrderModel = model<IPatientOrder>("PatientPatientOrder", PatientOrderSchema);
  
  export default PatientOrderModel;