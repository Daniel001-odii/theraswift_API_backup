"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const careerOpeningSchema = new mongoose_1.default.Schema({
    position: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("CareerOpening", careerOpeningSchema);
