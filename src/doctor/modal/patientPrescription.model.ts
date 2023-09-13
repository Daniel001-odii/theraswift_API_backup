import { Schema, model } from "mongoose";
import { IPatientPrescription } from "../interface/prescription.interface";

const PatientPrescriptionSchema = new Schema(
    {
      drugName: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      dosageForm: {
        type: String,
        enum: ["tablet", "capsule", "syrub", "drop"],
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      route: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["delivered", "not delivered"],
        required: true,
      },
      processingStatus: {
        type: String,
        required: true,
      },
      doctorId:{
        type: Schema.Types.ObjectId, ref: 'DoctorReg'
      },
      patientId:{
        type: Schema.Types.ObjectId, ref: 'PatientReg'
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
  
  const PatientPrescriptionModel = model<IPatientPrescription>("PatientPrescription", PatientPrescriptionSchema);
  
  export default PatientPrescriptionModel;