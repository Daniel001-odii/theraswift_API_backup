import { Document, model, Schema } from "mongoose";
import { Prescription } from "../interface/generalInterface";

export enum PrescriptionType {
  DoctorPrescription = "doctor-prescription",
  PharmacyPrescription = "pharmacy-prescription",
  NonPrescription = "non-prescription",
}



const prescriptionSchema = new Schema<Prescription>({
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  // },
  userId: {
    type:String,
    required: true,
  },
  type: { type: String, enum: Object.values(PrescriptionType), required: false },
  name: { type: String, required: false },
  strength: { type: String, required: false },
  frequency: { type: String, required: false },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  doctor: Object,
  pharmacy: Object,
  prescriptionImageUrl: String
});

let PrescriptionModel = model<Prescription>("Prescription", prescriptionSchema);
export default PrescriptionModel;
