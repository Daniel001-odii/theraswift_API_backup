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
exports.getsingleUserController = exports.getPageUserDeatilController = exports.getAllUsersController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../../user/models/userReg.model"));
const medication_model_1 = __importDefault(require("../../user/models/medication.model"));
//get all users /////////////
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userReg_model_1.default.find();
        let userArry = [];
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const usermedication = yield medication_model_1.default.find({ userId: user._id }).populate('medicationId');
            const userObj = {
                id: user._id,
                userId: user.userId,
                email: user.email,
                firstName: user.firstName,
                dateOfBirth: user.dateOfBirth,
                lastName: user.lastName,
                mobileNumber: user.mobileNumber,
                gender: user.gender,
                refererCode: user.refererCode,
                refererCredit: user.refererCredit,
                reference: user.reference,
                operatingLocation: user.operatingLocation,
                usermedication
            };
            userArry.push(userObj);
        }
        return res.status(200).json({
            message: "success",
            users: userArry
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getAllUsersController = getAllUsersController;
//get spage of user detail /////////////
const getPageUserDeatilController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { howMany } = req.body;
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 10; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalusers = yield userReg_model_1.default.countDocuments(); // Get the total number of documents
        const users = yield userReg_model_1.default.find()
            .skip(skip)
            .limit(limit);
        let userArry = [];
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const usermedication = yield medication_model_1.default.find({ userId: user._id }).populate('medicationId');
            const userObj = {
                id: user._id,
                userId: user.userId,
                email: user.email,
                firstName: user.firstName,
                dateOfBirth: user.dateOfBirth,
                lastName: user.lastName,
                mobileNumber: user.mobileNumber,
                gender: user.gender,
                refererCode: user.refererCode,
                refererCredit: user.refererCredit,
                reference: user.reference,
                operatingLocation: user.operatingLocation,
                usermedication
            };
            userArry.push(userObj);
        }
        return res.status(200).json({
            message: "success",
            users: userArry,
            currentPage: page,
            totalPages: Math.ceil(totalusers / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getPageUserDeatilController = getPageUserDeatilController;
//get single user detail /////////////
const getsingleUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = yield userReg_model_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ message: "user not found" });
        }
        const usermedication = yield medication_model_1.default.find({ userId }).populate('medicationId');
        const userObj = {
            id: user === null || user === void 0 ? void 0 : user._id,
            userId: user === null || user === void 0 ? void 0 : user.userId,
            email: user === null || user === void 0 ? void 0 : user.email,
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
            gender: user === null || user === void 0 ? void 0 : user.gender,
            refererCode: user === null || user === void 0 ? void 0 : user.refererCode,
            refererCredit: user === null || user === void 0 ? void 0 : user.refererCredit,
            reference: user === null || user === void 0 ? void 0 : user.reference,
            operatingLocation: user === null || user === void 0 ? void 0 : user.operatingLocation
        };
        return res.status(200).json({
            message: "success",
            user: { profile: userObj, usermedication }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getsingleUserController = getsingleUserController;
