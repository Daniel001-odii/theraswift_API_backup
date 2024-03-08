import { Schema, model } from "mongoose";
import { IDeliver } from "../interface/deliver.interface";

const DeliverSchema = new Schema(
    {
      driverId: {
        type: Schema.Types.ObjectId, ref: 'DriverReg',
      },
      userId: {
        type: String,   
      },
      orderId: {
        type: String,
      },
      enoughFuel: {
        type: String,
        enum: ["yes", "no"],
      },
      phoneCharge: {
        type: String,
        enum: ["yes", "no"],
      },
      theraswitId: {
        type: String,
        enum: ["yes", "no"],
      },
      deliveredStatus: {
        type: String,
        enum: ["initiate", "pickup", "startTrip", "delivered", "comfirmDelivered"],
      },
      deliveredImage: {
        type: String,
        default: '',
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
  
  const DeliverModel = model<IDeliver>("Deliver", DeliverSchema);
  
  export default DeliverModel;