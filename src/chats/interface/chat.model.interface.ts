import { Document, Types, ObjectId } from "mongoose";


export interface ChatInterface extends Document {
    _id: ObjectId;
    user: string;
    text: string;
    room: ObjectId;
}