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
exports.deleteAccountWithOTP = exports.sendDeleteOTP = exports.userDeleteMyAccountController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
const otpGenerator_2 = require("../../utils/otpGenerator");
//user delete data/////////////
const userDeleteMyAccountController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //delete user from database
        const deleteUser = yield userReg_model_1.default.findOneAndDelete({ _id: userId }, { new: true });
        if (!deleteUser) {
            return res
                .status(401)
                .json({ message: "unable to delete accout" });
        }
        return res.status(200).json({
            message: "account deleted succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userDeleteMyAccountController = userDeleteMyAccountController;
// send user account deletion OTP....
const sendDeleteOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log("checking for email: ", email);
        const user = yield userReg_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "user with email not found" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        user.emailOtp = {
            otp,
            createdTime,
            verified: true,
        };
        yield user.save();
        // send otp email here...
        let emailData = {
            emailTo: email,
            subject: "Theraswift account deletion request",
            otp,
            firstName: user.firstName,
        };
        (0, send_email_utility_1.sendAccountDeleteEmail)(emailData);
        return res.status(200).json({ message: `OTP sent successfully to your email`, email: email });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.sendDeleteOTP = sendDeleteOTP;
// user provides same OTP sent to email...
// OTP is compared with one saved in DB
// delete account if matched
// delete user account using provided OTP from email...
const deleteAccountWithOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        // get user with the requested OTP...
        const user = yield userReg_model_1.default.findOne({ "emailOtp.otp": otp });
        if (!user) {
            return res.status(400).json({ message: "invalid OTP provided, please try again" });
        }
        ;
        if (user.isDeleted) {
            return res.status(401).json({ message: "user account is deleted" });
        }
        // check if otp is still valid...[1 hour timeframe]
        const { createdTime, verified } = user.emailOtp;
        const timeDiff = new Date().getTime() - createdTime.getTime();
        if (!verified || timeDiff > otpGenerator_2.OTP_EXPIRY_TIME || otp !== user.emailOtp.otp) {
            return res
                .status(401)
                .json({ message: "unable to delete account" });
        }
        ;
        // soft delete user account...
        user.isDeleted = true;
        yield user.save();
        res.status(200).json({ message: "user account deleted successfully." });
    }
    catch (error) {
        console.log("error deleting user account with OTP: ", error);
    }
});
exports.deleteAccountWithOTP = deleteAccountWithOTP;
