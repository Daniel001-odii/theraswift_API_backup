import { Schema, model } from "mongoose";
import { IPatientHmo, } from "../interface/patientHmo.interface";

const PatientHmoSchema = new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      EnroleNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      medicalCode: {
        type: String,
        required: true,
      },
      medicalRecord: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "denied"],
        required: true,
      },
      doctorId:{
        type: Schema.Types.ObjectId, ref: 'DoctorReg'
      },
      patientId:{
        type: Schema.Types.ObjectId, ref: 'PatientReg'
      },
      hmoID:{
        type: Schema.Types.ObjectId, ref: 'DoctorReg'
      },
      clinicCode: {
        type: String,
        required: true,
      },
      orderId: {
        type: Schema.Types.ObjectId, ref: 'OrderFromDoctor'
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
  
  const PatientHmoModel = model<IPatientHmo>("PatientHmo", PatientHmoSchema);
  
  export default PatientHmoModel;