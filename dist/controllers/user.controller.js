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
exports.addUserMedicationController = exports.getUserWithAccessTokenController = exports.getUserController = exports.getUsersController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUsersController = getUsersController;
const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userId } = req.body;
        if (userId && email) {
            res.status(500).json({
                message: "please pass in either a user_id or an email address",
            });
            return;
        }
        let user;
        // Find the token in the database
        if (email) {
            user = yield User_model_1.default.findOne({ email });
        }
        // check if user exists
        if (!userId) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }
        else {
            user = yield User_model_1.default.findOne({
                userId,
            });
        }
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const userInfo = {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            role: user.role,
        };
        res.status(200).json({ user: userInfo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserController = getUserController;
const getUserWithAccessTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let secret = process.env.JWT_SECRET_KEY;
        // Get JWT from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        //   res.status(200).json({
        //     welcome: "welcome to theraswift api",
        //   });
        const { userId, email } = jsonwebtoken_1.default.verify(token, secret);
        let user;
        // Find the token in the database
        if (email) {
            user = yield User_model_1.default.findOne({ email });
        }
        else {
            user = yield User_model_1.default.findOne({
                userId,
            });
        }
        res.json({
            user: {
                _id: user === null || user === void 0 ? void 0 : user._id,
                userId: user === null || user === void 0 ? void 0 : user.userId,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                email: user === null || user === void 0 ? void 0 : user.email,
                gender: user === null || user === void 0 ? void 0 : user.gender,
                mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
                role: user === null || user === void 0 ? void 0 : user.role,
                walletBalance: user === null || user === void 0 ? void 0 : user.theraWallet,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserWithAccessTokenController = getUserWithAccessTokenController;
const addUserMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userMedications } = req.body;
        let secret = process.env.JWT_SECRET_KEY;
        // Get JWT from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const { userId, email, _id } = jsonwebtoken_1.default.verify(token, secret);
        let user;
        // Find the token in the database
        if (email) {
            user = yield User_model_1.default.findOne({ email });
        }
        else {
            user = yield User_model_1.default.findOne({
                userId,
            });
        }
        if (!user) {
            return res.status(500).send("User not found!");
        }
        yield User_model_1.default.findOneAndUpdate({ _id }, { $set: { userMedications } });
        let updatedUserValue = yield User_model_1.default.findById(_id);
        // console.log(updatedUserValue)
        // console.log(_id)
        res.json({
            message: "Medication added to user successfully",
            user: {
                _id: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue._id,
                userId: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.userId,
                firstName: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.firstName,
                lastName: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.lastName,
                email: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.email,
                gender: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.gender,
                mobileNumber: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.mobileNumber,
                role: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.role,
                walletBalance: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.theraWallet,
                dateOfBirth: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.dateOfBirth,
                userMedications: updatedUserValue === null || updatedUserValue === void 0 ? void 0 : updatedUserValue.userMedications,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addUserMedicationController = addUserMedicationController;
