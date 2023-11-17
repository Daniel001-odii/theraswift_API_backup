import { Schema, model } from "mongoose";
import { IPatientMedicationImage } from "../interface/medicationByImage.interface";

const PatientMedicationImageSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
    
      patientMedicationImage: {
        type: String,
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
  
  const PatientMedicationImageModel = model<IPatientMedicationImage>("PatientMedicationImage", PatientMedicationImageSchema);
  
  export default PatientMedicationImageModel;