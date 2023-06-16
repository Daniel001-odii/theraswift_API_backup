"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PasswordResetTokenSchema = new mongoose_1.Schema({
    otp: { type: String, required: true },
    token: { type: String, required: true },
    userId: String,
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    tokenExpirationTime: { type: Date, required: true },
    otpExpirationTime: { type: Date, required: true },
});
const PasswordResetToken = (0, mongoose_1.model)("PasswordResetToken", PasswordResetTokenSchema);
exports.default = PasswordResetToken;
