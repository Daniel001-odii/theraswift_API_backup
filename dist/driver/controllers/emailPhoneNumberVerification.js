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
exports.driverPhoneNumberVerificationController = exports.driverSendPhoneNumberController = exports.driverEmailVerificationController = exports.driverSendEmailController = void 0;
const express_validator_1 = require("express-validator");
const reg_model_1 = __importDefault(require("./../model/reg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
//driver send email /////////////
const driverSendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const driver = yield reg_model_1.default.findOne({ email });
        // check if user exists
        if (!driver) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        driver.emailOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (driver === null || driver === void 0 ? void 0 : driver.save());
        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: driver.firstName,
        };
        (0, send_email_utility_1.sendEmail)(emailData);
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverSendEmailController = driverSendEmailController;
//driver verified email /////////////
const driverEmailVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const driver = yield reg_model_1.default.findOne({ email });
        // check if user exists
        if (!driver) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        if (driver.emailOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (driver.emailOtp.verified) {
            return res
                .status(401)
                .json({ message: "email already verified" });
        }
        const timeDiff = new Date().getTime() - driver.emailOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        driver.emailOtp.verified = true;
        yield driver.save();
        return res.json({ message: "email verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverEmailVerificationController = driverEmailVerificationController;
//driver send phone number /////////////
const driverSendPhoneNumberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const driver = yield reg_model_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!driver) {
            return res
                .status(401)
                .json({ message: "invalid mobile number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        driver.phoneNumberOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (driver === null || driver === void 0 ? void 0 : driver.save());
        let sms = `Hello ${driver.firstName} your Theraswift mobile number verification OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverSendPhoneNumberController = driverSendPhoneNumberController;
//driver verified phone number /////////////
const driverPhoneNumberVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const driver = yield reg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!driver) {
            return res
                .status(401)
                .json({ message: "invalid mobile number" });
        }
        if (driver.phoneNumberOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (driver.phoneNumberOtp.verified) {
            return res
                .status(401)
                .json({ message: "mobile number already verified" });
        }
        const timeDiff = new Date().getTime() - driver.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        driver.phoneNumberOtp.verified = true;
        yield driver.save();
        return res.json({ message: "mobile number verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverPhoneNumberVerificationController = driverPhoneNumberVerificationController;
