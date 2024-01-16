import { Schema, model } from "mongoose";
import { IPatientReg } from "../interface/reg_interface";

const PatientSchema = new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
      },
      dateOFBirth: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      medicalRecord: {
        type: String,
        default: '',
      },
      hmo: {
        type: String,
        default: '',
      },
      doctorId:{
        type: Schema.Types.ObjectId, ref: 'DoctorReg'
      },
      clinicCode: {
        type: String,
        required: true,
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
  
  const PatientModel = model<IPatientReg>("PatientReg", PatientSchema);
  
  export default PatientModel;