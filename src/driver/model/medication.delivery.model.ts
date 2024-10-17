import { Schema, model } from "mongoose";

import { MedicationDeliveryInterface } from "../interface/medication_delivery.interface";

const DeliverSchema = new Schema(
    {
     
      patient:{
        type: Schema.Types.ObjectId, ref: 'UserReg',
      },
      medicationId: String,
      amount: Number,
      address: String,
      driverId: {
        type: Schema.Types.ObjectId, ref: 'DriverReg',
      },
      deliveredStatus: {
        type: String,
        enum: ["initiate", "pickup", "startTrip", "delivered", "comfirmDelivered"],
      },
      prescriber: {
        type: Schema.Types.ObjectId, ref: 'DoctorReg',
      }
    },
    {
      timestamps: true,
    }
  );
  
  const MedicationDeliveryModel = model<MedicationDeliveryInterface>("MedicationDelivery", DeliverSchema);
  
  export default MedicationDeliveryModel;