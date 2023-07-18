"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    sender: { type: String, required: true },
    // sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: String, required: true },
    // receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)('Chat', ChatSchema);
