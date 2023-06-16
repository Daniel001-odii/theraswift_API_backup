"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    HmoName: {
        type: String
    },
    front_insurance_image: {
        type: String,
    },
    back_insurance_image: {
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
const HMOModel = (0, mongoose_1.model)("HMO", UserSchema);
exports.default = HMOModel;
