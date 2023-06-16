"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileOtpResendController = exports.mobileOtpVerificationController = exports.mobileOtpController = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const sendSmsUtility_1 = require("../utils/sendSmsUtility");
const otpGenerator_1 = require("../utils/otpGenerator");
const utils_1 = require("../utils/utils");
// sending otp logic
const mobileOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = req.body;
    try {
        // Check if the mobile number already exists in the database
        const existingUser = yield User_model_1.default.findOne({ mobileNumber });
        if (!existingUser) {
            return res.json({
                message: "mobile number doesn't exist"
            });
        }
        // Generate a new OTP
        let otp = (0, otpGenerator_1.generateOTP)();
        console.log(otp);
        // Save the OTP in the database
        const createdTime = new Date();
        existingUser.mobileOtp = {
            otp,
            createdTime,
            verified: false,
        };
        yield (existingUser === null || existingUser === void 0 ? void 0 : existingUser.save());
        // Send the OTP to the mobile number using termii third-party SMS API
        let sms = `Hello ${existingUser.firstName} your Theraswift mobile number verification OTP is ${otp}`;
        let data = { to: mobileNumber, sms };
        (0, sendSmsUtility_1.sendSms)(data);
        // For demo purposes, we'll just log the OTP to the console
        return res.json({
            message: `OTP sent successfully ${mobileNumber}: ${otp}`,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.mobileOtpController = mobileOtpController;
// verifying otp logic
const mobileOtpVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber, otp } = req.body;
    try {
        // Check if the mobile number exists in the database
        const user = yield User_model_1.default.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ message: "Mobile number not found" });
        }
        // Check if the OTP is valid and not expired
        const { mobileOtp } = user;
        const timeDiff = new Date().getTime() - mobileOtp.createdTime.getTime();
        if (otp !== mobileOtp.otp || timeDiff > utils_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Update the mobile OTP verification status to true
        user.mobileOtp.verified = true;
        yield user.save();
        return res.json({ message: "OTP verified successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.mobileOtpVerificationController = mobileOtpVerificationController;
// resending otp logic
const mobileOtpResendController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = req.body;
    try {
        // Check if the mobile number exists in the database
        const existingUser = yield User_model_1.default.findOne({ mobileNumber });
        if (!existingUser) {
            return res.json({
                message: "mobile number doesn't exist"
            });
        }
        // Generate a new OTP
        let otp = (0, otpGenerator_1.generateOTP)();
        console.log(otp);
        // Save the OTP in the database
        const createdTime = new Date();
        existingUser.mobileOtp = {
            otp,
            createdTime,
            verified: false,
        };
        yield (existingUser === null || existingUser === void 0 ? void 0 : existingUser.save());
        // Send the OTP to the mobile number using termii third-party SMS API
        let sms = `Hello ${existingUser.firstName} your Theraswift mobile number verification OTP is ${otp}`;
        let data = { to: mobileNumber, sms };
        (0, sendSmsUtility_1.sendSms)(data);
        return res.json({
            message: `New OTP sent successfully ${mobileNumber}: ${otp}`,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.mobileOtpResendController = mobileOtpResendController;
