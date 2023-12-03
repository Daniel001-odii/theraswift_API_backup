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
exports.userMobileResetPasswordController = exports.userMobileForgotPasswordController = exports.userEmailResetPasswordController = exports.userEmailForgotPasswordController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const send_email_utility_1 = require("../../utils/send_email_utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
//user forgot password through email /////////////
const userEmailForgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const user = yield userReg_model_1.default.findOne({ email });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        user.passwordOtp = {
            otp,
            createdTime,
            verified: true
        };
        yield (user === null || user === void 0 ? void 0 : user.save());
        let emailData = {
            emailTo: email,
            subject: "Theraswift password change",
            otp,
            firstName: user.firstName,
        };
        (0, send_email_utility_1.sendEmail)(emailData);
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userEmailForgotPasswordController = userEmailForgotPasswordController;
//user reset password through email /////////////
const userEmailResetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const user = yield userReg_model_1.default.findOne({ email });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        const { createdTime, verified } = user.passwordOtp;
        const timeDiff = new Date().getTime() - createdTime.getTime();
        if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== user.passwordOtp.otp) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.passwordOtp.verified = false;
        yield user.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userEmailResetPasswordController = userEmailResetPasswordController;
//user forgot password through mobile number /////////////
const userMobileForgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // try find user with the same email
        const user = yield userReg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid phone number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        user.passwordOtp = {
            otp,
            createdTime,
            verified: true
        };
        yield (user === null || user === void 0 ? void 0 : user.save());
        let sms = `Hello ${user.firstName} your Theraswift password change OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userMobileForgotPasswordController = userMobileForgotPasswordController;
//user reset password through mobile number /////////////
const userMobileResetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, otp, password } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // try find user with the same phone number
        const user = yield userReg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid phone number" });
        }
        const { createdTime, verified } = user.passwordOtp;
        const timeDiff = new Date().getTime() - createdTime.getTime();
        if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== user.passwordOtp.otp) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.passwordOtp.verified = false;
        yield user.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userMobileResetPasswordController = userMobileResetPasswordController;
