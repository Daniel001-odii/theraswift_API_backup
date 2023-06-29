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
const express_validator_1 = require("express-validator");
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userIdGen_1 = require("../utils/userIdGen");
const mobileNumberFormatter_1 = require("../utils/mobileNumberFormatter");
// signup logic
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, mobileNumber, password, dateOfBirth, gender, role } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const userEmailExists = yield User_model_1.default.findOne({ email });
        const userNumberExists = yield User_model_1.default.findOne({ mobileNumber });
        // console.log(userEmailExists,userNumberExists);
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
        // console.log("newNum ",newNum);
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
            role
        });
        let userSaved = yield user.save();
        console.log(userSaved);
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: userSaved === null || userSaved === void 0 ? void 0 : userSaved._id,
            userId: userSaved.userId,
            email: userSaved.email,
            firstName: userSaved.firstName,
            lastName: userSaved.lastName,
            role: userSaved.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: userSaved === null || userSaved === void 0 ? void 0 : userSaved._id,
            userId: userSaved.userId,
            email: userSaved.email,
            firstName: userSaved.firstName,
            lastName: userSaved.lastName,
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
                dateOfBirth: userSaved.dateOfBirth
            },
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.default = signup;
