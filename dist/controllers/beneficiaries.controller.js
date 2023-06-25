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
exports.getUserBeneficiaryByIdController = exports.getUserBeneficiariesController = exports.addNewBeneficiaryController = exports.getBeneficiaryInfoController = void 0;
const Beneficiaries_model_1 = __importDefault(require("../models/Beneficiaries.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getBeneficiaryInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { beneficiaryUserId } = req.body;
        console.log("beneficiaryUserId ", beneficiaryUserId);
        // check if needed parameters are sent in the body
        if (!beneficiaryUserId)
            return res
                .status(400)
                .json({ message: "please send required body queries" });
        // check if beneficiary exist in the database
        const existingBeneficiaryUser = yield User_model_1.default.findOne({
            userId: beneficiaryUserId,
        });
        if (!existingBeneficiaryUser) {
            return res
                .status(400)
                .json({ message: "Beneficiary does not exists as a user" });
        }
        res.status(200).send({
            firstName: existingBeneficiaryUser.firstName,
            lastName: existingBeneficiaryUser.lastName,
            beneficiaryUserId: existingBeneficiaryUser.userId,
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err.message, message: "internal server error" });
        console.log(err.message);
    }
});
exports.getBeneficiaryInfoController = getBeneficiaryInfoController;
const addNewBeneficiaryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, beneficiaryUserId } = req.body;
        // check if needed parameters are sent in the body
        if (!userId || !beneficiaryUserId)
            return res
                .status(400)
                .json({ message: "please send required body queries" });
        // Check if the user exists in the database
        const existingUser = yield User_model_1.default.findOne({ userId });
        // check if beneficiary exist in the database
        const existingBeneficiaryUser = yield User_model_1.default.findOne({
            userId: beneficiaryUserId,
        });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!existingBeneficiaryUser) {
            return res
                .status(400)
                .json({ message: "Beneficiary does not exists as a user" });
        }
        let newBeneficiaryAdded = {};
        newBeneficiaryAdded = new Beneficiaries_model_1.default({
            userId,
            beneficiaryUserId: existingBeneficiaryUser.userId,
            firstName: existingBeneficiaryUser.firstName,
            lastName: existingBeneficiaryUser.lastName,
        });
        let newBeneficiaryResp = yield newBeneficiaryAdded.save();
        const formattedBeneficiary = {
            userId,
            firstName: newBeneficiaryResp.firstName,
            lastName: newBeneficiaryResp.lastName,
            beneficiaryUserId,
        };
        return res.status(201).json({
            message: "Beneficiary created successfully",
            new_beneficiary: formattedBeneficiary,
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err.message, message: "internal server error" });
        console.log(err.message);
    }
});
exports.addNewBeneficiaryController = addNewBeneficiaryController;
const getUserBeneficiariesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let secret = process.env.JWT_SECRET_KEY;
        // Get JWT from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const { userId } = jsonwebtoken_1.default.verify(token, secret);
        let data = yield Beneficiaries_model_1.default.find({ userId });
        if (!data || data.length === 0) {
            return res.status(200).json({
                user_beneficiaries: [],
                message: "No Beneficiary found",
            });
        }
        const formattedData = data.map((beneficiary) => ({
            userId,
            beneficiaryUserId: beneficiary.userId,
            firstName: beneficiary.firstName,
            lastName: beneficiary.lastName,
        }));
        res.status(200).json({
            user_beneficiaries: formattedData,
            message: "Beneficiaries retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserBeneficiariesController = getUserBeneficiariesController;
const getUserBeneficiaryByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { beneficiary_id } = req.body;
    try {
        let data = yield Beneficiaries_model_1.default.findById(beneficiary_id);
        if (!data)
            return res.status(404).json({ message: "Beneficiary not found" });
        const formattedBeneficiary = {
            beneficiaryUserId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
        };
        res.status(200).json({ user_beneficiaries: formattedBeneficiary });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserBeneficiaryByIdController = getUserBeneficiaryByIdController;
