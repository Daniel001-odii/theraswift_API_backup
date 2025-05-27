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
exports.adminGetSingleHmo = exports.adminGetHmo = void 0;
const express_validator_1 = require("express-validator");
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
// admin get hmo detail 
const adminGetHmo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const hmos = yield doctor_reg_modal_1.default.find({ organization: "HMO" })
            .skip(skip)
            .limit(limit);
        const totalHmo = yield doctor_reg_modal_1.default.countDocuments({ organization: "HMO" }); // Get the total number of documents
        return res.status(200).json({
            hmos,
            currentPage: page,
            totalPages: Math.ceil(totalHmo / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetHmo = adminGetHmo;
// admin get single hmo detail 
const adminGetSingleHmo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { hmoId } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const hmo = yield doctor_reg_modal_1.default.findOne({ _id: hmoId, organization: "HMO" });
        if (!hmo) {
            return res
                .status(401)
                .json({ message: "incorrect HMO ID" });
        }
        return res.status(200).json({
            hmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetSingleHmo = adminGetSingleHmo;
