"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userId: {
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
    dateOfBirth: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "doctor"],
        default: "user",
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
    mobileOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    theraWallet: {
        type: Number,
        min: 0,
        default: 0
    },
    userMedications: {
        type: [String]
    },
}, {
    timestamps: true,
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
