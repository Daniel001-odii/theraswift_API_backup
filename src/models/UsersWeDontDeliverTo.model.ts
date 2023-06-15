import { Schema, model } from "mongoose";
import { IUsersWeDontDeliverTo } from "../interface/generalInterface";

const UsersWeDontDeliverToSchema = new Schema({
  email: {
    type: String,
    required: false,
    unique: false,
  },
  address: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
});

const UsersWeDontDeliverToModel = model<IUsersWeDontDeliverTo>('UsersWeDontDeliverTo', UsersWeDontDeliverToSchema);

export default UsersWeDontDeliverToModel;
