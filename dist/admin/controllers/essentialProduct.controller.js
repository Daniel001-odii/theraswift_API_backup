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
exports.deleteEssentialProductController = exports.editEssentialProductController = exports.searchEssentialProductByNameController = exports.getPageEssentialProductController = exports.adminAddEssentialProductController = void 0;
const express_validator_1 = require("express-validator");
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
const essentialProduct_model_1 = __importDefault(require("../models/essentialProduct.model"));
const essentialCategori_model_1 = __importDefault(require("../models/essentialCategori.model"));
//admin add essential product /////////////
const adminAddEssentialProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Access the uploaded file details
        const file = req.file;
        // const fileName = file?.filename;
        // const filePath = file?.path;
        let medicationImg;
        const { name, price, uses, quantity, categoryId, inventoryQauntity, ingredient, expiryDate, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const categoryDb = yield essentialCategori_model_1.default.findOne({ _id: categoryId.toString() });
        if (!categoryDb) {
            return res.status(401).json({ message: "category do not exist" });
        }
        if (!file) {
            return res.status(401).json({ message: "provide product image." });
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            medicationImg = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
            //medicationImg = uploadToS3(file);
        }
        const essentialProduct = new essentialProduct_model_1.default({
            categoryId,
            name,
            price: price,
            uses,
            quantity: quantity,
            medicationImage: medicationImg,
            ingredient,
            inventoryQauntity,
            expiryDate,
            category: categoryDb === null || categoryDb === void 0 ? void 0 : categoryDb.name
        });
        const savedEssentialProduct = yield essentialProduct.save();
        return res.status(200).json({
            message: "product added successfuuy",
            product: savedEssentialProduct
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminAddEssentialProductController = adminAddEssentialProductController;
//admin get page essential product /////////////
const getPageEssentialProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const totalProduct = yield essentialProduct_model_1.default.countDocuments(); // Get the total number of documents
        const products = yield essentialProduct_model_1.default.find().sort({ createdAt: -1 })
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
exports.getPageEssentialProductController = getPageEssentialProductController;
//admin search product by name /////////////
const searchEssentialProductByNameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productName } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const products = yield essentialProduct_model_1.default.find({ name: { $regex: new RegExp(productName, 'i') } });
        return res.status(200).json({
            products,
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.searchEssentialProductByNameController = searchEssentialProductByNameController;
//admin edit product by Id /////////////
const editEssentialProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        // const fileName = file?.filename;
        // const filePath = file?.path;
        let medicationImg;
        const { productId, name, price, uses, quantity, categoryId, inventoryQauntity, ingredient, expiryDate, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const product = yield essentialProduct_model_1.default.findOne({ _id: productId });
        if (!product) {
            return res.status(401).json({ message: "product do not exist" });
        }
        const categoryDb = yield essentialCategori_model_1.default.findOne({ _id: categoryId });
        if (!categoryDb) {
            return res.status(401).json({ message: "category do not exist" });
        }
        if (!file) {
            medicationImg = product.medicationImage;
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            medicationImg = result === null || result === void 0 ? void 0 : result.Location;
        }
        const updatedProduct = yield essentialProduct_model_1.default.findOneAndUpdate({ _id: productId }, {
            categoryId,
            name,
            price: price,
            uses,
            quantity: quantity,
            medicationImage: medicationImg,
            ingredient,
            inventoryQauntity,
            expiryDate,
            category: categoryDb === null || categoryDb === void 0 ? void 0 : categoryDb.name
        }, { new: true });
        return res.status(200).json({
            message: "product updated successfuuy",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.editEssentialProductController = editEssentialProductController;
//admin delete product by Id /////////////
const deleteEssentialProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const product = yield essentialProduct_model_1.default.findOne({ _id: productId });
        if (!product) {
            return res.status(401).json({ message: "product do not exist" });
        }
        const deleteProduct = yield essentialProduct_model_1.default.findOneAndDelete({ _id: productId }, { new: true });
        return res.status(200).json({
            message: "product deleted successfuuy",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.deleteEssentialProductController = deleteEssentialProductController;
