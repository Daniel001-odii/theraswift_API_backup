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
exports.makeUserAdminController = exports.addAdminController = exports.signUpController = void 0;
const express_validator_1 = require("express-validator");
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userIdGen_1 = require("../utils/userIdGen");
const mobileNumberFormatter_1 = require("../utils/mobileNumberFormatter");
// signup logic
const signUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, mobileNumber, password, dateOfBirth, gender, role, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const userEmailExists = yield User_model_1.default.findOne({ email });
        const userNumberExists = yield User_model_1.default.findOne({ mobileNumber });
        // check if user exists
        if (userEmailExists || userNumberExists) {
            return res
                .status(401)
                .json({ message: "Email or Mobile Number exists already" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // format mobile number to international format
        let newNum = (0, mobileNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // getting userID out of users mobile number
        let userId = (0, userIdGen_1.userIdGen)(mobileNumber);
        // Save user to MongoDB
        const user = new User_model_1.default({
            userId,
            email,
            firstName,
            dateOfBirth,
            lastName,
            password: hashedPassword,
            mobileNumber: newNum,
            gender,
            role,
        });
        let userSaved = yield user.save();
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: userSaved === null || userSaved === void 0 ? void 0 : userSaved._id,
            userId: userSaved.userId,
            email: userSaved.email,
            firstName: userSaved.firstName,
            lastName: userSaved.lastName,
            mobileNumber: user.mobileNumber,
            role: userSaved.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: userSaved === null || userSaved === void 0 ? void 0 : userSaved._id,
            userId: userSaved.userId,
            email: userSaved.email,
            firstName: userSaved.firstName,
            lastName: userSaved.lastName,
            mobileNumber: user.mobileNumber,
            role: userSaved.role,
        }, process.env.REFRESH_JWT_SECRET_KEY, { expiresIn: "24h" });
        res.json({
            message: "Signup successful",
            user: {
                _id: userSaved._id,
                userId: userSaved.userId,
                firstName: userSaved.firstName,
                lastName: userSaved.lastName,
                email: userSaved.email,
                gender: userSaved.gender,
                mobileNumber: userSaved.mobileNumber,
                role: userSaved.role,
                walletBalance: userSaved.theraWallet,
                dateOfBirth: userSaved.dateOfBirth,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.signUpController = signUpController;
const addAdminController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, mobileNumber, password, dateOfBirth, gender, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const userEmailExists = yield User_model_1.default.findOne({ email });
        const userNumberExists = yield User_model_1.default.findOne({ mobileNumber });
        // check if user exists
        if (userEmailExists || userNumberExists) {
            return res
                .status(401)
                .json({
                message: "Email or mobile number exists already, consider making user admin.",
            });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // format mobile number to international format
        let newNum = (0, mobileNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // getting userID out of users mobile number
        let userId = (0, userIdGen_1.userIdGen)(mobileNumber);
        // Save user to MongoDB
        const user = new User_model_1.default({
            userId,
            email,
            firstName,
            dateOfBirth,
            lastName,
            password: hashedPassword,
            mobileNumber: newNum,
            gender,
            role: "admin",
        });
        let adminSaved = yield user.save();
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: adminSaved === null || adminSaved === void 0 ? void 0 : adminSaved._id,
            userId: adminSaved.userId,
            email: adminSaved.email,
            firstName: adminSaved.firstName,
            lastName: adminSaved.lastName,
            mobileNumber: user.mobileNumber,
            role: adminSaved.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: adminSaved === null || adminSaved === void 0 ? void 0 : adminSaved._id,
            userId: adminSaved.userId,
            email: adminSaved.email,
            firstName: adminSaved.firstName,
            lastName: adminSaved.lastName,
            mobileNumber: user.mobileNumber,
            role: adminSaved.role,
        }, process.env.REFRESH_JWT_SECRET_KEY, { expiresIn: "24h" });
        res.json({
            message: "Admin added successfully",
            user: {
                _id: adminSaved._id,
                userId: adminSaved.userId,
                firstName: adminSaved.firstName,
                lastName: adminSaved.lastName,
                email: adminSaved.email,
                gender: adminSaved.gender,
                mobileNumber: adminSaved.mobileNumber,
                role: adminSaved.role,
                walletBalance: adminSaved.theraWallet,
                dateOfBirth: adminSaved.dateOfBirth,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.addAdminController = addAdminController;
const makeUserAdminController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        // check if user exists
        if (!userId) {
            return res.status(401).json({ message: "Please send userId." });
        }
        // try find user with the same userId
        const userExists = yield User_model_1.default.findOne({ userId });
        // check if user exists
        if (!userExists) {
            return res.status(401).json({ message: "User does not exists." });
        }
        const updatedUserRole = yield User_model_1.default.findByIdAndUpdate(userExists === null || userExists === void 0 ? void 0 : userExists._id, { role: "admin" }, { new: true });
        res.status(200).json({
            message: "User made admin successfully",
            user: updatedUserRole,
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.makeUserAdminController = makeUserAdminController;
