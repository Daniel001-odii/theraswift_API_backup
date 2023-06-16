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
exports.updatePasswordController = exports.verifyPasswordRecoveryOtpController = exports.smsOtpRequestController = exports.emailOtpRequestController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const PasswordRecoveryToken_model_1 = __importDefault(require("../models/PasswordRecoveryToken.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const otpGenerator_1 = require("../utils/otpGenerator");
const sendEmailUtility_1 = require("../utils/sendEmailUtility");
const sendSmsUtility_1 = require("../utils/sendSmsUtility");
const utils_1 = require("../utils/utils");
const crypto_1 = __importDefault(require("crypto"));
// send otp mail to the users gmail & save it to the database
const emailOtpRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Check if the user exists
        const user = yield User_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        // Generate a new OTP
        let otp = (0, otpGenerator_1.generateOTP)();
        // Save the OTP in the database
        const createdTime = new Date();
        const tokenExists = yield PasswordRecoveryToken_model_1.default.findOne({ email });
        if (tokenExists) {
            tokenExists.otp = otp;
            tokenExists.otpExpirationTime = createdTime;
            yield (tokenExists === null || tokenExists === void 0 ? void 0 : tokenExists.save());
            return res.status(201).send({ message: "otp sent successfully!" });
        }
        let newPasswordResetToken = new PasswordRecoveryToken_model_1.default({
            otp,
            otpExpirationTime: createdTime,
        });
        let emailData = {
            emailTo: email,
            subject: "Theraswift Password Recovery OTP",
            otp,
            firstName: user.firstName,
        };
        yield (0, sendEmailUtility_1.sendPasswordRecoveryEmail)(emailData);
        let newOtpEntry = yield (newPasswordResetToken === null || newPasswordResetToken === void 0 ? void 0 : newPasswordResetToken.save());
        res.status(201).send({ message: "otp sent successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.emailOtpRequestController = emailOtpRequestController;
// send sms otp to the users mobile phone & save it to the database or update
const smsOtpRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber } = req.body;
        // Check if the user exists
        const user = yield User_model_1.default.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        // Generate a new OTP
        let otp = (0, otpGenerator_1.generateOTP)();
        // Save the OTP in the database
        const createdTime = new Date();
        const tokenExists = yield PasswordRecoveryToken_model_1.default.findOne({ mobileNumber });
        if (tokenExists) {
            tokenExists.otp = otp;
            tokenExists.otpExpirationTime = createdTime;
            yield (tokenExists === null || tokenExists === void 0 ? void 0 : tokenExists.save());
            return res.status(201).send({ message: "otp sent successfully!" });
        }
        let newPasswordResetToken = new PasswordRecoveryToken_model_1.default({
            otp,
            otpExpirationTime: createdTime,
            userId: user.userId,
        });
        // Send the OTP to the mobile number using termii third-party SMS API
        let sms = `Hello ${user.firstName} your Theraswift password recovery verification OTP is ${otp}`;
        let data = { to: mobileNumber, sms };
        (0, sendSmsUtility_1.sendSms)(data);
        let newOtpEntry = yield (newPasswordResetToken === null || newPasswordResetToken === void 0 ? void 0 : newPasswordResetToken.save());
        res.status(201).send({ message: "otp sent successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.smsOtpRequestController = smsOtpRequestController;
// verify the otp and create a token and save it in the db
const verifyPasswordRecoveryOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    try {
        // Check if the otp exists in the database
        const otpExists = yield PasswordRecoveryToken_model_1.default.findOne({ otp });
        if (!otpExists) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Check if the OTP is valid and not expired
        const timeDiff = new Date().getTime() - otpExists.otpExpirationTime.getTime();
        if (otp !== otpExists.otp || timeDiff > utils_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Generate a token with a length of 8
        const token = crypto_1.default.randomBytes(4).toString("hex");
        const createdTime = new Date();
        otpExists.token = token;
        otpExists.tokenExpirationTime = createdTime;
        yield otpExists.save();
        const hashedToken = yield bcrypt_1.default.hash(token, 10);
        return res.json({ passwordRecoveryToken: hashedToken });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.verifyPasswordRecoveryOtpController = verifyPasswordRecoveryOtpController;
const updatePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password, email, mobileNumber } = req.body;
    let passwordResetTokenInfo;
    if (email && mobileNumber)
        return res
            .status(400)
            .json({ message: "either password or email should be provided" });
    // Find the token in the database
    if (email) {
        passwordResetTokenInfo = yield PasswordRecoveryToken_model_1.default.findOne({ email });
    }
    if (mobileNumber) {
        passwordResetTokenInfo = yield PasswordRecoveryToken_model_1.default.findOne({
            mobileNumber,
        });
    }
    const isTokenMatch = yield bcrypt_1.default.compare(token, passwordResetTokenInfo.token);
    if (!isTokenMatch)
        return res.status(500).json({ message: "Invalid password recovery token" });
    const timeDiff = new Date().getTime() - passwordResetTokenInfo.tokenExpirationTime.getTime();
    if (timeDiff > utils_1.OTP_EXPIRY_TIME) {
        return res.status(400).json({ message: "Invalid password recovery token" });
    }
    // Update the user's password in the database
    const user = yield User_model_1.default.findOne(passwordResetTokenInfo.userId);
    if (!user)
        return res.status(400).json({ message: "User not found" });
    const hashedPassword = yield bcrypt_1.default.hash(token, 10);
    user.password = hashedPassword;
    yield user.save();
    // Invalidate the token by deleting it from the database
    yield passwordResetTokenInfo.delete();
    res.status(200).json({ message: "Password updated successfully" });
});
exports.updatePasswordController = updatePasswordController;
