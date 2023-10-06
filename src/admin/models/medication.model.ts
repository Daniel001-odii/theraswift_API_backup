import { Schema, model } from "mongoose";
import { IMedication } from "../interface/medication.interface";

const MedicationSchema = new Schema(
    {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      price: {
        type: String,
      },
      strength: {
        type: String,
      },
      quantity: {
        type: String,
      },
      medicationImage: {
        type: String,
      },
      prescriptionRequired: {
        type: Boolean,
        default: false,
      },
      form:{
        type: String,
      },
      ingredient: {
        type: String,
      },
      medInfo: {
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
  
  const MedicationModel = model<IMedication>("Medication", MedicationSchema);
  
  export default MedicationModel;