import { Schema, model } from "mongoose";
import { IMedication } from "../interface/medication.interface";

const MedicationSchema = new Schema(
    {
      name: {
        type: String,
      },
      price: {
        type: String,
      },
      quantity: {
        type: String,
      },
      medicationImage: {
        type: String,
      },
      prescriptionRequired: {
        type: String,
        enum: ["required", "not required", "neccessary"],
      },
      form:{
        type: String,
      },
      ingredient: {
        type: String,
      },
      quantityForUser: {
        type: String,
      },
      inventoryQuantity: {
        type: String,
      },
      expiredDate: {
        type: String,
      },
      category: {
        type: String,
      },
      medInfo: {
        overView: String,
        howToUse: String,
        sideEffect: String,
        storage: String,
        drugInteraction: String,
        overdose: String,
        more: String,
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