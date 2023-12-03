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
    medicalCode: {
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
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg'
    },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'PatientReg'
    },
    hmoID: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg'
    },
    clinicCode: {
        type: String,
        required: true,
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'OrderFromDoctor'
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
