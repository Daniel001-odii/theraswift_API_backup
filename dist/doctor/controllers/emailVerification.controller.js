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
exports.doctorPhoneNumberVerificationController = exports.doctorSendPhoneNumberController = exports.doctorEmailVerificationController = exports.doctorSendEmailController = void 0;
const express_validator_1 = require("express-validator");
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
//doctor send email /////////////
const doctorSendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ email });
        // check if user exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        doctor.emailOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (doctor === null || doctor === void 0 ? void 0 : doctor.save());
        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: doctor.firstName,
        };
        (0, send_email_utility_1.sendEmail)(emailData);
        // sendUserAccountVerificationEmail
        return res.status(200).json({ message: "OTP sent successfully to your email." });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSendEmailController = doctorSendEmailController;
//doctor verified email /////////////
const doctorEmailVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ email });
        // check if user exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        if (doctor.emailOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (doctor.emailOtp.verified) {
            return res
                .status(401)
                .json({ message: "email already verified" });
        }
        const timeDiff = new Date().getTime() - doctor.emailOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        doctor.emailOtp.verified = true;
        yield doctor.save();
        return res.json({ message: "email verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorEmailVerificationController = doctorEmailVerificationController;
//doctor send phone number /////////////
const doctorSendPhoneNumberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                .json({ message: "invalid mobile number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        doctor.phoneNumberOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (doctor === null || doctor === void 0 ? void 0 : doctor.save());
        let sms = `Hello ${doctor.firstName} your Theraswift mobile number verification OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSendPhoneNumberController = doctorSendPhoneNumberController;
//doctor verified phone number /////////////
const doctorPhoneNumberVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const doctor = yield doctor_reg_modal_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid mobile number" });
        }
        if (doctor.phoneNumberOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (doctor.phoneNumberOtp.verified) {
            return res
                .status(401)
                .json({ message: "mobile number already verified" });
        }
        const timeDiff = new Date().getTime() - doctor.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        doctor.phoneNumberOtp.verified = true;
        yield doctor.save();
        return res.json({ message: "mobile number verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorPhoneNumberVerificationController = doctorPhoneNumberVerificationController;
