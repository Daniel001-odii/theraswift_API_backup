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
exports.driverMobileResetPasswordController = exports.driverMobileForgotPasswordController = exports.driverResetPassworController = exports.driverEmailForgotPassworController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const reg_model_1 = __importDefault(require("./../model/reg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
// driver email forgot password
const driverEmailForgotPassworController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find admin with the same email
        const driver = yield reg_model_1.default.findOne({ email });
        if (!driver) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        //generate new otp
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        driver.passwordOtp = {
            otp,
            createdTime,
            verified: true
        };
        yield driver.save();
        let emailData = {
            emailTo: email,
            subject: "Theraswift password change",
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
exports.driverEmailForgotPassworController = driverEmailForgotPassworController;
// driver email reset password
const driverResetPassworController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find admin with the same email
        const driver = yield reg_model_1.default.findOne({ email, });
        if (!driver) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        const { createdTime, verified } = driver.passwordOtp;
        const timeDiff = new Date().getTime() - createdTime.getTime();
        if (verified == false || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== driver.passwordOtp.otp) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        driver.password = hashedPassword;
        driver.passwordOtp.verified = false;
        yield driver.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverResetPassworController = driverResetPassworController;
//driver forgot password through mobile number /////////////
const driverMobileForgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                .json({ message: "invalid phone number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        driver.passwordOtp = {
            otp,
            createdTime,
            verified: true
        };
        yield (driver === null || driver === void 0 ? void 0 : driver.save());
        let sms = `Hello ${driver.firstName} your Theraswift password change OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverMobileForgotPasswordController = driverMobileForgotPasswordController;
//driver reset password through mobile number /////////////
const driverMobileResetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const driver = yield reg_model_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!driver) {
            return res
                .status(401)
                .json({ message: "invalid phone number" });
        }
        const { createdTime, verified } = driver.passwordOtp;
        const timeDiff = new Date().getTime() - createdTime.getTime();
        if (!verified || timeDiff > otpGenerator_1.OTP_EXPIRY_TIME || otp !== driver.passwordOtp.otp) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        driver.password = hashedPassword;
        driver.passwordOtp.verified = false;
        yield driver.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverMobileResetPasswordController = driverMobileResetPasswordController;
