import { Document, model, Schema } from "mongoose";
import { Prescription } from "../interface/generalInterface";

export enum PrescriptionType {
  DoctorPrescription = "doctor-prescription",
  PharmacyPrescription = "pharmacy-prescription",
  NonPrescription = "non-prescription",
}



const prescriptionSchema = new Schema<Prescription>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: { type: String, enum: Object.values(PrescriptionType), required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  doctor: Object,
  pharmacy: Object,
});

let PrescriptionModel = model<Prescription>("Prescription", prescriptionSchema);
export default PrescriptionModel;
