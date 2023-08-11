"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DispenseLogSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    dosage: {
        type: String,
    },
    dateOfBirth: String,
    dispenser: {
        type: String,
        required: true,
    },
    prescriber: {
        type: String,
        required: true,
    },
    dateDispensed: String,
    orderId: String,
}, {
    timestamps: true,
});
const DispenseLogModel = (0, mongoose_1.model)("User", DispenseLogSchema);
exports.default = DispenseLogModel;
