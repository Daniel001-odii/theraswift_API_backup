"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FrequenceAskSchema = new mongoose_1.Schema({
    question: {
        type: String,
    },
    answer: {
        type: String,
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
const FrequenceAskModel = (0, mongoose_1.model)("FrequenceAsk", FrequenceAskSchema);
exports.default = FrequenceAskModel;
