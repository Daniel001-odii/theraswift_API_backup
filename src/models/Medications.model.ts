import { Schema, model } from "mongoose";
import { IMedication } from "../interface/generalInterface";

// Define medication schema
const medicationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  warnings: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  // expiryDate: {
  //   type: Date,
  // },
  sideEffects: {
    type: [String],
  },
  ingredients: {
    type: [String],
  },
  storageInstructions: {
    type: String,
  },
  contraindications: {
    type: [String],
  },
  routeOfAdministration: {
    type: String,
  },
  prescription_required: {
    type: Boolean,
  },
});

// Define medication model
const Medication = model<IMedication>("Medications", medicationSchema);

// Export Medication model for use in other modules
export default Medication;
