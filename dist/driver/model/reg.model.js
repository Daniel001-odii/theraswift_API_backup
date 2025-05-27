"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DriverSchema = new mongoose_1.Schema({
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
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    practiseCode: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        required: true,
    },
    referralCode: {
        type: String,
        default: ""
    },
    licensePlate: {
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
    passwordOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    phoneNumberOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
}, {
    timestamps: true,
});
const DriverModel = (0, mongoose_1.model)("DriverReg", DriverSchema);
exports.default = DriverModel;
