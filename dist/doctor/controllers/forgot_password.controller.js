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
exports.doctorMobileResetPasswordController = exports.doctorMobileForgotPasswordController = exports.doctorResetPassworController = exports.doctorForgotPassworController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const doctorForgotPassworController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find doctor with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ email });
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        //generate new otp
        const otp = (0, otpGenerator_1.generateOTP)();
        doctor.passwordToken = parseInt(otp);
        doctor.passwordChangeStatus = true;
        yield doctor.save();
        let emailData = {
            emailTo: email,
            subject: "Theraswift Email Verification",
            otp,
            firstName: doctor.firstName,
        };
        (0, send_email_utility_1.sendEmail)(emailData);
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorForgotPassworController = doctorForgotPassworController;
const doctorResetPassworController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find doctor with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ email, passwordToken: otp });
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        if (doctor.passwordChangeStatus == false) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        doctor.passwordChangeStatus = false;
        doctor.password = hashedPassword;
        yield doctor.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorResetPassworController = doctorResetPassworController;
//doctor forgot password through mobile number /////////////
const doctorMobileForgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const doctor = yield doctor_reg_modal_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid phone number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        doctor.passwordToken = parseInt(otp);
        doctor.passwordChangeStatus = true;
        yield (doctor === null || doctor === void 0 ? void 0 : doctor.save());
        let sms = `Hello ${doctor.firstName} your Theraswift password change OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorMobileForgotPasswordController = doctorMobileForgotPasswordController;
//doctor reset password through mobile number /////////////
const doctorMobileResetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const doctor = yield doctor_reg_modal_1.default.findOne({ phoneNumber: phonenumber, passwordToken: otp });
        // check if user exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid phone number 0r otp" });
        }
        if (doctor.passwordChangeStatus == false) {
            return res
                .status(401)
                .json({ message: "unable to reset password" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        doctor.passwordChangeStatus = false;
        doctor.password = hashedPassword;
        yield doctor.save();
        return res.status(200).json({ message: "password successfully change" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorMobileResetPasswordController = doctorMobileResetPasswordController;
