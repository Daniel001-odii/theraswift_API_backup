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
    /*  reciever: {
       type: String,
       
     }, */
    text: {
        type: String,
    },
    room: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'chatRoom',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const ChatModel = (0, mongoose_1.model)("UserChat", ChatSchema);
exports.default = ChatModel;
