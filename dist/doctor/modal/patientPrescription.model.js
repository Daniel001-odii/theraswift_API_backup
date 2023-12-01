"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PatientPrescriptionSchema = new mongoose_1.Schema({
    dosage: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["delivered", "pending"],
        required: true,
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg'
    },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'PatientReg'
    },
    medicationId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Medication'
    },
    clinicCode: {
        type: String,
        required: true,
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
const PatientPrescriptionModel = (0, mongoose_1.model)("PatientPrescription", PatientPrescriptionSchema);
exports.default = PatientPrescriptionModel;
