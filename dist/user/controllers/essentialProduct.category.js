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
exports.getEssentialProductBycategoryController = exports.getPageEssentialCategoryController = void 0;
const express_validator_1 = require("express-validator");
const essentialProduct_model_1 = __importDefault(require("../../admin/models/essentialProduct.model"));
const essentialCategori_model_1 = __importDefault(require("../../admin/models/essentialCategori.model"));
// get page essential category /////////////
const getPageEssentialCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const page = parseInt(req.query.page) || 1; // Page number, default to 1
        const limit = parseInt(req.query.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalCategories = yield essentialCategori_model_1.default.countDocuments(); // Get the total number of documents
        const categories = yield essentialCategori_model_1.default.find().sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            categories,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getPageEssentialCategoryController = getPageEssentialCategoryController;
// get page essential products /////////////
const getEssentialProductBycategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { categoryId, page, limit } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalProduct = yield essentialProduct_model_1.default.countDocuments({ categoryId }); // Get the total number of documents
        const products = yield essentialProduct_model_1.default.find({ categoryId }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProduct / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getEssentialProductBycategoryController = getEssentialProductBycategoryController;
