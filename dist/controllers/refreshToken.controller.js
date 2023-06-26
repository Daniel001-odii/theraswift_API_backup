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
exports.refreshTokenVerificationController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
// refresh token verification route controller
const refreshTokenVerificationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let secret = process.env.REFRESH_JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: "Authorization refresh token missing" });
    }
    console.log(token);
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        // Check if email and mobile are in the MongoDB
        const user = yield User_model_1.default.findOne({
            email: payload.email,
            mobile: payload.mobile,
            role: { $in: ["admin", "user"] },
        });
        const accessToken = jsonwebtoken_1.default.sign({
            _id: user === null || user === void 0 ? void 0 : user._id,
            userId: user === null || user === void 0 ? void 0 : user.userId,
            email: user === null || user === void 0 ? void 0 : user.email,
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            role: user === null || user === void 0 ? void 0 : user.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({
            message: "AccessToken regenerated  successful",
            accessToken,
        });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.refreshTokenVerificationController = refreshTokenVerificationController;
// export default refreshTokenVerificationController;
