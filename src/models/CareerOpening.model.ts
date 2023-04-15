import mongoose, { Schema, Document } from "mongoose";
import { ICareerOpening } from "../interface/generalInterface";

const careerOpeningSchema: Schema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ICareerOpening>(
  "CareerOpening",
  careerOpeningSchema
);
