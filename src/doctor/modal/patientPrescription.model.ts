import { Schema, model } from "mongoose";
import { IPatientPrescription } from "../interface/prescription.interface";

const PatientPrescriptionSchema = new Schema(
    {
      dosage: {
        type: String,
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
        enum: ["delivered", "pending"],
        required: true,
      },
      doctorId:{
        type: Schema.Types.ObjectId, ref: 'DoctorReg'
      },
      patientId:{
        type: Schema.Types.ObjectId, ref: 'PatientReg'
      },

      medications: [
        {
          type: Schema.Types.ObjectId, ref: 'Medication'
        }
      ],
      /* medicationId: {
        type: Schema.Types.ObjectId, ref: 'Medication'
      }, */
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
  
  const PatientPrescriptionModel = model<IPatientPrescription>("PatientPrescription", PatientPrescriptionSchema);
  
  export default PatientPrescriptionModel;