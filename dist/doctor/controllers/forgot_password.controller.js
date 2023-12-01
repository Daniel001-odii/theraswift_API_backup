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
exports.doctorResetPassworController = exports.doctorForgotPassworController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
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
