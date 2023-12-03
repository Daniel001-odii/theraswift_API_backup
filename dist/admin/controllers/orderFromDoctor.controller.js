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
exports.adminGetDeliverdDoctorOder = exports.adminGetPaidDoctorOder = exports.adminGetPendingDoctorOder = void 0;
const express_validator_1 = require("express-validator");
const orderFromDoctor_model_1 = __importDefault(require("../../admin/models/orderFromDoctor.model"));
// admin get pending order from doctor 
const adminGetPendingDoctorOder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pendingOder = yield orderFromDoctor_model_1.default.find({ status: "pending" })
            .populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalOrders = yield orderFromDoctor_model_1.default.countDocuments({ status: "pending" }); // Get the total number of documents
        return res.status(200).json({
            pendingOder,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetPendingDoctorOder = adminGetPendingDoctorOder;
// admin get paid order from doctor 
const adminGetPaidDoctorOder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const paidOder = yield orderFromDoctor_model_1.default.find({ status: "paid" })
            .populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalOrders = yield orderFromDoctor_model_1.default.countDocuments({ status: "paid" }); // Get the total number of documents
        return res.status(200).json({
            paidOder,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetPaidDoctorOder = adminGetPaidDoctorOder;
// admin get delivered order from doctor 
const adminGetDeliverdDoctorOder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const deliveredOder = yield orderFromDoctor_model_1.default.find({ status: "delivered" })
            .populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalOrders = yield orderFromDoctor_model_1.default.countDocuments({ status: "delivered" }); // Get the total number of documents
        return res.status(200).json({
            deliveredOder,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDeliverdDoctorOder = adminGetDeliverdDoctorOder;
