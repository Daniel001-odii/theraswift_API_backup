import { Schema, model, Document } from 'mongoose';

interface IChat extends Document {
  sender: string;
  receiver: string;
  message: string;
  createdAt: Date;
}

const ChatSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IChat>('Chat', ChatSchema);
