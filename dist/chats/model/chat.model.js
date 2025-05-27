"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.Schema({
    user: {
        type: String,
    },
    text: {
        type: String,
    },
    room: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'ChatRoom',
    },
}, {
    timestamps: true,
});
const ChatModel = mongoose_2.default.model('Chats', ChatSchema);
exports.default = ChatModel;
