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
exports.adminMobileResetPasswordController = exports.adminMobileForgotPasswordController = exports.adminResetPassworController = exports.adminForgotPassworController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_reg_model_1 = __importDefault(require("../models/admin_reg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const adminForgotPassworController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find admin with the same email
        const admin = yield admin_reg_model_1.default.findOne({ email });
        if (!admin) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        //generate new otp
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        admin.passwordOtp = {
            otp,
            createdTime,
            verified: true
        };
        yield admin.save();
        let emailData = {
            emailTo: email,
            subject: "Theraswift password change",
            otp,
            firstName: "admin",
        };
        (0, send_email_utility_1.sendEmail)(emailData);
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminForgotPassworController = adminForgotPassworController;
const adminResetPassworController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find admin with the same email
        const admin = yield admin_reg_model_1.default.findOne({ email, });
        if (!admin) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        const { createdTime, verified } = admin.passwordOtp;
        const timeDiff = new Date().getTime() - createdTime.getTime();
        if (verified == false || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== admin.passwordOtp.otp) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        admin.password = hashedPassword;
        admin.passwordOtp.verified = false;
        yield admin.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminResetPassworController = adminResetPassworController;
//admin forgot password through mobile number /////////////
const adminMobileForgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const admin = yield admin_reg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!admin) {
            return res
                .status(401)
                .json({ message: "invalid phone number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        admin.passwordOtp = {
            otp,
            createdTime,
            verified: true
        };
        yield (admin === null || admin === void 0 ? void 0 : admin.save());
        let sms = `Hello ${admin.firstName} your Theraswift password change OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminMobileForgotPasswordController = adminMobileForgotPasswordController;
//admin reset password through mobile number /////////////
const adminMobileResetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const admin = yield admin_reg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!admin) {
            return res
                .status(401)
                .json({ message: "invalid phone number" });
        }
        const { createdTime, verified } = admin.passwordOtp;
        const timeDiff = new Date().getTime() - createdTime.getTime();
        if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== admin.passwordOtp.otp) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        admin.password = hashedPassword;
        admin.passwordOtp.verified = false;
        yield admin.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminMobileResetPasswordController = adminMobileResetPasswordController;
