"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        unique: false,
        lowercase: true,
    },
    dateOfBirth: {
        type: String,
        required: false,
    },
    mobileNumber: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
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
const FamilyModel = (0, mongoose_1.model)("Family", UserSchema);
exports.default = FamilyModel;
