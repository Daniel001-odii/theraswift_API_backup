"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DoctorSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        enum: ["clinic", "hospital", "HMO"],
        required: true,
    },
    clinicCode: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    passwordToken: {
        type: Number
    },
    passwordChangeStatus: {
        type: Boolean
    }
}, {
    timestamps: true,
});
const DoctotModel = (0, mongoose_1.model)("DoctorReg", DoctorSchema);
exports.default = DoctotModel;
