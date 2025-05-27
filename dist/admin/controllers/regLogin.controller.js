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
exports.adminMobileNumberSignInController = exports.adminSignInController = exports.adminSignUpController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_reg_model_1 = __importDefault(require("../models/admin_reg.model"));
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
//admin signup /////////////
const adminSignUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, dateOfBirth, lastName, phoneNumber, gender, practiseCode } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(phoneNumber);
        // try find user with the same email
        const adminEmailExists = yield admin_reg_model_1.default.findOne({ email });
        const adminNumberExists = yield admin_reg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (adminEmailExists || adminNumberExists) {
            return res
                .status(401)
                .json({ message: "Email or Mobile Number exists already" });
        }
        let practiseCodeReal = "";
        let topAdmin = "no";
        if (practiseCode) {
            const checkPractiseCode = yield admin_reg_model_1.default.findOne({ practiseCode, topAdmin: "yes" });
            if (!checkPractiseCode) {
                return res
                    .status(401)
                    .json({ message: "incorrect practise code" });
            }
            practiseCodeReal = practiseCode;
        }
        else {
            topAdmin = "yes";
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const admin = new admin_reg_model_1.default({
            email: email,
            firstName: firstName,
            dateOFBirth: dateOfBirth,
            lastName: lastName,
            password: hashedPassword,
            phoneNumber: phonenumber,
            gender: gender,
            practiseCode: practiseCodeReal,
            topAdmin: topAdmin
        });
        let adminSaved = yield admin.save();
        res.json({
            message: "Signup successful",
            user: {
                id: adminSaved._id,
                firstName: adminSaved.firstName,
                lastName: adminSaved.lastName,
                email: adminSaved.email,
                gender: adminSaved.gender,
                mobileNumber: adminSaved.phoneNumber,
            },
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminSignUpController = adminSignUpController;
//admin signin by email/////////////
const adminSignInController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find admin with the same email
        const admin = yield admin_reg_model_1.default.findOne({ email });
        // check if admin exists
        if (!admin) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        if (!admin.emailOtp.verified) {
            return res.status(401).json({ message: "email not verified." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            id: admin === null || admin === void 0 ? void 0 : admin._id,
            email: admin.email,
        }, process.env.JWT_ADMIN_SECRET_KEY);
        // return access token
        res.json({
            message: "Login successful",
            Token: accessToken,
            _id: admin === null || admin === void 0 ? void 0 : admin._id
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminSignInController = adminSignInController;
//admin signin  with mobile number/////////////
const adminMobileNumberSignInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, password, } = req.body;
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
                .json({ message: "invalid credential" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        if (!admin.phoneNumberOtp.verified) {
            return res.status(401).json({ message: "mobile number not verified." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            id: admin === null || admin === void 0 ? void 0 : admin._id,
            email: admin.email,
            mobileNumber: admin.phoneNumber,
        }, process.env.JWT_User_SECRET_KEY);
        // return access token
        res.json({
            message: "Login successful",
            Token: accessToken
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminMobileNumberSignInController = adminMobileNumberSignInController;
