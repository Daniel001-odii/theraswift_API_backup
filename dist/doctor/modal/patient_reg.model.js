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
        upload: {
            front: {
                type: String,
                required: false,
            },
            back: {
                type: String,
                required: false,
            }
        },
        inputtedDetails: {
            hmoEmployer: {
                type: String,
                required: false,
            },
            plan: {
                type: String,
                required: false,
            },
            regNumber: {
                type: String,
                required: false,
            },
            beneficiaries: {
                type: [String],
                required: false,
            },
        },
        wasUploaded: {
            type: Boolean,
            default: false,
        },
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
