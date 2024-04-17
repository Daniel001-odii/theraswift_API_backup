import { Schema, model } from "mongoose";
import { IRemoveMedication } from "../interface/removeMedication.interface";

const RemoveMedicationSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      medicationId: {
        type: String,
        require: true
      },
      reason: {
        type: String,
        require: true
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
  
  const RemoveMedicationModel = model<IRemoveMedication>("RemoveMedication", RemoveMedicationSchema);
  
  export default RemoveMedicationModel;