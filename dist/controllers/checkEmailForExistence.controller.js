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
exports.checkEmailForExistenceController = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const checkEmailForExistenceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_model_1.default.findOne({ email });
        if (user) {
            return res
                .status(200)
                .json({
                message: "User exists with the provided email.",
                existingUser: true,
            });
        }
        else {
            return res
                .status(200)
                .json({
                message: "No user exists with the provided email.",
                existingUser: false,
            });
        }
    }
    catch (error) {
        console.error("Error checking user by email:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
exports.checkEmailForExistenceController = checkEmailForExistenceController;
