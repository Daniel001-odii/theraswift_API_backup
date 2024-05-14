import { Schema, model } from "mongoose";
import { IUserMedication } from "../interface/medication.interface";

const UserMedicationSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
      },
      medicationId: {
        type: Schema.Types.ObjectId, ref: 'Medication',
        required: true,
      },
      prescriptionStatus: {
        type: Boolean,
        required: true,
        default: true
      },
      prescriptionImage: {
        type: String,
        default: "",
      },
      doctor: {
        type: Schema.Types.ObjectId,
        default: null,
      },
      clinicCode: {
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
  
  const UserMedicationModel = model<IUserMedication>("UserMedication", UserMedicationSchema);
  
  export default UserMedicationModel;