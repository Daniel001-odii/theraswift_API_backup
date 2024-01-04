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
exports.adminPhoneNumberVerificationController = exports.adminSendPhoneNumberController = exports.adminEmailVerificationController = exports.adminSendEmailController = void 0;
const express_validator_1 = require("express-validator");
const admin_reg_model_1 = __importDefault(require("../models/admin_reg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
//admin send email /////////////
const adminSendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const admin = yield admin_reg_model_1.default.findOne({ email });
        // check if user exists
        if (!admin) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        admin.emailOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (admin === null || admin === void 0 ? void 0 : admin.save());
        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: admin.firstName,
        };
        (0, send_email_utility_1.sendEmail)(emailData);
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminSendEmailController = adminSendEmailController;
//admin verified email /////////////
const adminEmailVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const admin = yield admin_reg_model_1.default.findOne({ email });
        // check if user exists
        if (!admin) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        if (admin.emailOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (admin.emailOtp.verified) {
            return res
                .status(401)
                .json({ message: "email already verified" });
        }
        const timeDiff = new Date().getTime() - admin.emailOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        admin.emailOtp.verified = true;
        yield admin.save();
        return res.json({ message: "email verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminEmailVerificationController = adminEmailVerificationController;
//admin send phone number /////////////
const adminSendPhoneNumberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const admin = yield admin_reg_model_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!admin) {
            return res
                .status(401)
                .json({ message: "invalid mobile number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        admin.phoneNumberOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (admin === null || admin === void 0 ? void 0 : admin.save());
        let sms = `Hello ${admin.firstName} your Theraswift mobile number verification OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminSendPhoneNumberController = adminSendPhoneNumberController;
//admin verified phone number /////////////
const adminPhoneNumberVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, otp } = req.body;
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
                .json({ message: "invalid mobile number" });
        }
        if (admin.phoneNumberOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (admin.phoneNumberOtp.verified) {
            return res
                .status(401)
                .json({ message: "mobile number already verified" });
        }
        const timeDiff = new Date().getTime() - admin.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        admin.phoneNumberOtp.verified = true;
        yield admin.save();
        return res.json({ message: "mobile number verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminPhoneNumberVerificationController = adminPhoneNumberVerificationController;
