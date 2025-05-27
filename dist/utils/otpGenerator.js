"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SINGIN_LINK = exports.SINGUP_LINK = exports.OTP_EXPIRY_TIME = exports.generateOTP = void 0;
// Generate a new OTP
function generateOTP() {
    let otp = "";
    //const allowedChars =
    //  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const allowedChars = "0123456789";
    for (let i = 0; i < 4; i++) {
        otp += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return otp;
}
exports.generateOTP = generateOTP;
exports.OTP_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
exports.SINGUP_LINK = 'https://app.theraswift.co/medication/signup';
exports.SINGIN_LINK = 'https://app.theraswift.co/medication/signin';
