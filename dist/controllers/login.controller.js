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
exports.doctorsLoginController = exports.loginController = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const mobileNumberFormatter_1 = require("../utils/mobileNumberFormatter");
// login users
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, mobileNumber } = req.body;
        if (email && mobileNumber) {
            return res.status(500).json({
                message: "Please pass in either a mobile number or an email address",
            });
        }
        let user;
        if (email) {
            // try find user with email
            user = yield User_model_1.default.findOne({ email });
        }
        else if (mobileNumber) {
            // try find user with email
            let phoneNumber = (0, mobileNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
            user = yield User_model_1.default.findOne({ mobileNumber: phoneNumber });
        }
        // check if user exists
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: user === null || user === void 0 ? void 0 : user._id,
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: user === null || user === void 0 ? void 0 : user._id,
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }, process.env.REFRESH_JWT_SECRET_KEY, { expiresIn: "24h" });
        // return access token
        res.json({
            message: "Login successful",
            user: {
                _id: user._id,
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                mobileNumber: user.mobileNumber,
                role: user.role,
                walletBalance: user.theraWallet,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        // login error
        res.status(500).json({ message: err.message });
    }
});
exports.loginController = loginController;
// login doctors
const doctorsLoginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, mobileNumber } = req.body;
        if (email && mobileNumber) {
            return res.status(500).json({
                message: "Please pass in either a mobile number or an email address",
            });
        }
        let user;
        if (email) {
            // try find user with email
            user = yield User_model_1.default.findOne({
                email,
                role: { $in: ["doctor", "admin"] },
            });
        }
        else if (mobileNumber) {
            // try find user with email
            let phoneNumber = (0, mobileNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
            user = yield User_model_1.default.findOne({
                mobileNumber: phoneNumber,
                role: { $in: ["admin", "doctor"] },
            });
        }
        // check if user exists
        if (!user) {
            return res
                .status(403)
                .json({ message: "Invalid credentials." });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: user === null || user === void 0 ? void 0 : user._id,
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: user === null || user === void 0 ? void 0 : user._id,
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }, process.env.REFRESH_JWT_SECRET_KEY, { expiresIn: "24h" });
        // return access token
        res.json({
            message: "Login successful",
            user: {
                _id: user._id,
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                mobileNumber: user.mobileNumber,
                role: user.role,
                walletBalance: user.theraWallet,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        // login error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorsLoginController = doctorsLoginController;
