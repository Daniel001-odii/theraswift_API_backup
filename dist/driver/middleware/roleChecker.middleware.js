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
exports.checkDriverRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reg_model_1 = __importDefault(require("../model/reg.model"));
const checkDriverRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let secret = process.env.JWT_Driver_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }
    try {
        // Verify JWT and extract payload
        const payload = jsonwebtoken_1.default.verify(token, secret);
        // Check if email and mobile are in the MongoDB and belong to an admin role
        const driver = yield reg_model_1.default.findOne({
            email: payload.email
        });
        if (!driver) {
            return res
                .status(403)
                .json({ message: "Access denied. driver role required." });
        }
        // Add the payload to the request object for later use
        req.driver = payload;
        // Call the next middleware function
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid authorization token" });
    }
});
exports.checkDriverRole = checkDriverRole;
