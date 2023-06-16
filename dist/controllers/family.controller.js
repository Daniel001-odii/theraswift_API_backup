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
exports.deleteUserFamilyController = exports.getUserFamilyController = exports.addFamilyController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Family_model_1 = __importDefault(require("../models/Family.model"));
const addFamilyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { full_name, date_of_birth, gender, email, mobile_number, userId } = req.body;
        if (!full_name || !date_of_birth || !gender || !userId)
            return res.json({ message: "Family input not completed" });
        const newFamily = new Family_model_1.default({
            userId,
            fullName: full_name,
            dateOfBirth: date_of_birth,
            gender,
            email,
            mobileNumber: mobile_number,
        });
        let savedUser = yield newFamily.save();
        res.status(201).json({
            message: "New family member added successfully",
            family_member: savedUser,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addFamilyController = addFamilyController;
const getUserFamilyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { userId } = req.body;
        let secret = process.env.JWT_SECRET_KEY;
        // Get JWT from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const { userId } = jsonwebtoken_1.default.verify(token, secret);
        if (!userId)
            return res.json({ message: "please send user id" });
        let userFamilies = yield Family_model_1.default.find({ userId });
        res.status(201).json({
            message: "Family members retrieved successfully",
            family_members: userFamilies,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUserFamilyController = getUserFamilyController;
// export const getUserFamilyWithAuthTokenController = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) return res.json({ message: "please send user id" });
//     let userFamilies = await FamilyModel.find({ userId });
//     res.status(201).json({
//       message: "Family members retrieved successfully",
//       family_members: userFamilies,
//     });
//   } catch (err: any) {
//     res.status(500).json({error:err.message;
//   }
// };
const deleteUserFamilyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { family_id } = req.body;
        if (!family_id)
            return res.json({ message: "please send family member's id" });
        let userFamilies = yield Family_model_1.default.findByIdAndDelete(family_id);
        res.status(201).json({
            message: "Family members retrieved successfully",
            family_members: userFamilies,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteUserFamilyController = deleteUserFamilyController;
