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
    // required: true,
  },
  strength: {
    type: String,
    // required: true,
  },
  warnings: {
    type: String,
  },
  manufacturer: {
    type: String,
  },

  image_url: {
    type: String,
  },
  price: {
    type: Number,
    required: false,
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
  type:{
    type:String,
    // required:true,
  },
  medicationForms:{
    type:[String],
    // required:true,
  },
  medicationTypes:{
    type:[String],
    // required:true,
  },
  category:{
    type:String,
    required:true,
  }
});

// Define medication model
const Medication = model<IMedication>("Medications", medicationSchema);

// Export Medication model for use in other modules
export default Medication;
