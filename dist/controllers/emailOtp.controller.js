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
exports.resendEmailController = exports.verifyEmailController = exports.sendEmailController = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const otpGenerator_1 = require("../utils/otpGenerator");
const utils_1 = require("../utils/utils");
const sendEmailUtility_1 = require("../utils/sendEmailUtility");
// Define the endpoint to send the OTP to email
const sendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email = "yusufmustahan@gmail.com" } = req.body;
    try {
        // Check if the email already exists in the database
        const existingUser = yield User_model_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Email does not exists" });
        }
        // Generate a new OTP
        let otp = (0, otpGenerator_1.generateOTP)();
        // Save the OTP in the database
        const createdTime = new Date();
        existingUser.emailOtp = {
            otp,
            createdTime,
            verified: false,
        };
        yield (existingUser === null || existingUser === void 0 ? void 0 : existingUser.save());
        let emailData = {
            emailTo: email,
            subject: "Theraswift Email Verification",
            otp,
            firstName: existingUser.firstName,
        };
        yield (0, sendEmailUtility_1.sendEmail)(emailData);
        return res.json({ message: "OTP sent successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.sendEmailController = sendEmailController;
// verifying email otp logic
const verifyEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        // Check if the email exists in the database
        const user = yield User_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }
        // Check if the OTP is valid and not expired
        const { emailOtp } = user;
        const timeDiff = new Date().getTime() - emailOtp.createdTime.getTime();
        if (otp !== emailOtp.otp || timeDiff > utils_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Update the email OTP verification status to true
        user.emailOtp.verified = true;
        yield user.save();
        return res.json({ message: "OTP verified successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.verifyEmailController = verifyEmailController;
// resending otp logic
const resendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }
    try {
        // Find user by email
        const existingUser = yield User_model_1.default.findOne({ email });
        // Check if user exists
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }
        // Generate a new OTP
        let otp = (0, otpGenerator_1.generateOTP)();
        // Save the OTP in the database
        const createdTime = new Date();
        existingUser.emailOtp = {
            otp,
            createdTime,
            verified: false,
        };
        yield (existingUser === null || existingUser === void 0 ? void 0 : existingUser.save());
        let emailData = {
            emailTo: email,
            subject: "Theraswift Email Verification",
            otp,
            firstName: existingUser.firstName,
        };
        (0, sendEmailUtility_1.sendEmail)(emailData);
        // // Send email message
        // await sendEmail(emailData);
        return res.status(200).json({ message: "OTP sent successfully." });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
});
exports.resendEmailController = resendEmailController;
