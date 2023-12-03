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
exports.userEmailVerificationController = exports.userSendEmailController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
//user send email /////////////
const userSendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        user.emailOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (user === null || user === void 0 ? void 0 : user.save());
        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
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
exports.userSendEmailController = userSendEmailController;
//user verified email /////////////
const userEmailVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
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
        if (user.emailOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (user.emailOtp.verified) {
            return res
                .status(401)
                .json({ message: "email already verified" });
        }
        const timeDiff = new Date().getTime() - user.emailOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        user.emailOtp.verified = true;
        yield user.save();
        return res.json({ message: "email verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userEmailVerificationController = userEmailVerificationController;
