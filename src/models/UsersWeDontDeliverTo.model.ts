import { Schema, model } from "mongoose";
import { IUsersWeDontDeliverTo } from "../interface/generalInterface";

const UsersWeDontDeliverToSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UsersWeDontDeliverToSchema);

const UsersWeDontDeliverToModel = model<IUsersWeDontDeliverTo>('UsersWeDontDeliverTo', UsersWeDontDeliverToSchema);

export default UsersWeDontDeliverToModel;
