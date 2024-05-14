import { Schema, model } from "mongoose";
import { IAwaitingMedication } from "../interface/awaitingMedication.interface";

const AwaitingMedicationSchema = new Schema(
    {
      patientId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      medicationId: {
        type: Schema.Types.ObjectId,
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
  
  const AwaitingMedicationModel = model<IAwaitingMedication>("AwaitingMedication", AwaitingMedicationSchema);
  
  export default AwaitingMedicationModel;