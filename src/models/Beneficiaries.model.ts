import { Schema, model } from "mongoose";
import { IBeneficiaryAdded } from "../interface/generalInterface";

const BeneficiariesSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  beneficiaryUserId:{
    type:String,
    required:true
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
});

const Beneficiaries = model<IBeneficiaryAdded>('Beneficiaries', BeneficiariesSchema);

export default Beneficiaries;
