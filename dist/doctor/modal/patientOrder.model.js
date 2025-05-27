"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PatientOrderSchema = new mongoose_1.Schema({
    patientPrescriptionId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'PatientPrescription'
    },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'PatientReg'
    },
    medicationId: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    hmoClinicCode: {
        type: String,
        default: "",
    },
    clinicCode: {
        type: String,
    },
    patientPayment: {
        type: Number,
    },
    hmoPayment: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["delivered", "pending", "progress"],
        required: true,
    },
    toHmo: {
        type: String,
        enum: ["yes", "no"],
        required: true,
    },
    hmoState: {
        type: String,
        enum: ["admin", "hmo", "final", ""],
        default: "",
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
const PatientOrderModel = (0, mongoose_1.model)("PatientPatientOrder", PatientOrderSchema);
exports.default = PatientOrderModel;
