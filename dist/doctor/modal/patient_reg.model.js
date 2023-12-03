"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PatientSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    dateOFBirth: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    medicalRecord: {
        type: String,
        default: '',
    },
    hmo: {
        type: String,
        default: '',
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg'
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
const PatientModel = (0, mongoose_1.model)("PatientReg", PatientSchema);
exports.default = PatientModel;
