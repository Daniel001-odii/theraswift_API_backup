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
exports.driverMobileNumberSignInController = exports.driverEmailSignInController = exports.driverSignUpController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reg_model_1 = __importDefault(require("./../model/reg.model"));
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
//driver signup /////////////
const driverSignUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName, phoneNumber, gender, city, licensePlate } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(phoneNumber);
        // try find user with the same email
        const driverEmailExists = yield reg_model_1.default.findOne({ email });
        const driverNumberExists = yield reg_model_1.default.findOne({ phoneNumber });
        // check if user exists
        if (driverEmailExists || driverNumberExists) {
            return res
                .status(401)
                .json({ message: "Email or Mobile Number exists already" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const driver = new reg_model_1.default({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            phoneNumber: phonenumber,
            gender: gender,
            city,
            licensePlate
        });
        let driverSaved = yield driver.save();
        res.json({
            message: "Signup successful",
            driver: {
                id: driverSaved._id,
                firstName: driverSaved.firstName,
                lastName: driverSaved.lastName,
                email: driverSaved.email,
                gender: driverSaved.gender,
                mobileNumber: driverSaved.phoneNumber
            },
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.driverSignUpController = driverSignUpController;
//driver signin by email/////////////
const driverEmailSignInController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find driver with the same email
        const driver = yield reg_model_1.default.findOne({ email });
        // check if admin exists
        if (!driver) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, driver.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        if (!driver.emailOtp.verified) {
            return res.status(401).json({ message: "email not verified." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            id: driver === null || driver === void 0 ? void 0 : driver._id,
            email: driver.email,
        }, process.env.JWT_Driver_SECRET_KEY, { expiresIn: "24h" });
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
exports.driverEmailSignInController = driverEmailSignInController;
//driver signin  with mobile number/////////////
const driverMobileNumberSignInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const driver = yield reg_model_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!driver) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, driver.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        if (!driver.phoneNumberOtp.verified) {
            return res.status(401).json({ message: "mobile number not verified." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            id: driver === null || driver === void 0 ? void 0 : driver._id,
            email: driver.email,
            mobileNumber: driver.phoneNumber,
        }, process.env.JWT_Driver_SECRET_KEY, { expiresIn: "24h" });
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
exports.driverMobileNumberSignInController = driverMobileNumberSignInController;
