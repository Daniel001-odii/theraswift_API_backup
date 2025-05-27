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
exports.deleteEssentialCategoryController = exports.getPageEssentialCategoryController = exports.getAllEssentialCategoryController = exports.createEssentialCategoryController = void 0;
const express_validator_1 = require("express-validator");
const essentialCategori_model_1 = __importDefault(require("../models/essentialCategori.model"));
const essentialProduct_model_1 = __importDefault(require("../models/essentialProduct.model"));
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
//admin create essential category /////////////
const createEssentialCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, } = req.body;
        // Access the uploaded file details
        const file = req.file;
        let medicationImg;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!file) {
            return res.status(401).json({ message: "provide category image." });
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            medicationImg = result === null || result === void 0 ? void 0 : result.Location;
        }
        const essentialCategory = new essentialCategori_model_1.default({
            name: name.trim(),
            img: medicationImg
        });
        const savedEssentialCategory = yield essentialCategory.save();
        return res.status(200).json({
            message: "category created successfully ",
            category: savedEssentialCategory
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.createEssentialCategoryController = createEssentialCategoryController;
//admin get all essential category /////////////
const getAllEssentialCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const categories = yield essentialCategori_model_1.default.find().sort({ name: 1 });
        return res.status(200).json({
            categories
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getAllEssentialCategoryController = getAllEssentialCategoryController;
//admin get page essential category /////////////
const getPageEssentialCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalCategories = yield essentialCategori_model_1.default.countDocuments(); // Get the total number of documents
        const categories = yield essentialCategori_model_1.default.find().sort({ name: 1 })
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
//admin delete essential category /////////////
const deleteEssentialCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkCategory = yield essentialCategori_model_1.default.findOne({ _id: categoryId });
        if (!checkCategory) {
            return res.status(401).json({ message: "invalid category ID." });
        }
        const checkProducts = yield essentialProduct_model_1.default.find({ categoryId: checkCategory._id });
        if (checkProducts.length > 0) {
            return res.status(401).json({ message: "delete all product under this category first." });
        }
        const deleteProduct = yield essentialCategori_model_1.default.findOneAndDelete({ _id: categoryId }, { new: true });
        return res.status(200).json({
            message: "category deleted successfully ",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.deleteEssentialCategoryController = deleteEssentialCategoryController;
