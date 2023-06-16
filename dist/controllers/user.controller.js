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
exports.getUserWithAccessTokenController = exports.getUserController = exports.getUsersController = void 0;
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
        if (userId) {
            user = yield User_model_1.default.findOne({
                userId,
            });
        }
        res.json(user);
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
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserWithAccessTokenController = getUserWithAccessTokenController;
