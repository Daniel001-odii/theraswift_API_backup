"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PatientHmoSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    EnroleNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    medicalRecord: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "denied"],
        required: true,
    },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'PatientReg'
    },
    doctorClinicCode: {
        type: String,
        required: true,
    },
    icdCode: {
        type: String,
        required: true,
    },
    hmoClinicCode: {
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
const PatientHmoModel = (0, mongoose_1.model)("PatientHmo", PatientHmoSchema);
exports.default = PatientHmoModel;
