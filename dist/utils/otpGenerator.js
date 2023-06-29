"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
// Generate a new OTP
function generateOTP() {
    let otp = "";
    //const allowedChars =
    //  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const allowedChars = "0123456789";
    for (let i = 0; i < 6; i++) {
        otp += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return otp;
}
exports.generateOTP = generateOTP;
