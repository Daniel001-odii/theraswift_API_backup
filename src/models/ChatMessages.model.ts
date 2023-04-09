import { Document, Model, model, Schema } from "mongoose";

interface IMessage {
  from: string;
  to: string;
  text: string;
  createdAt: Date;
}

interface IMessageDocument extends IMessage, Document {}

interface IMessageModel extends Model<IMessageDocument> {}

const messageSchema: Schema<IMessageDocument, IMessageModel> = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const Message: IMessageModel = model<IMessageDocument, IMessageModel>(
  "Message",
  messageSchema
);

export { IMessage, IMessageDocument, IMessageModel, Message };
