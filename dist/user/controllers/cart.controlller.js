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
exports.userRefillStatusCartController = exports.userCartListController = exports.userRemoveMedicationToCartController = exports.userDecreaseMedicationToCartController = exports.userIncreaseMedicationToCartController = exports.userAddMedicationToCartController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const medication_model_1 = __importDefault(require("../models/medication.model"));
const medication_model_2 = __importDefault(require("../../admin/models/medication.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
//user add medication  to cart/////////////
const userAddMedicationToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMedicationId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        //get user medication
        const userMedication = yield medication_model_1.default.findOne({ _id: userMedicationId });
        if (!userMedication) {
            return res
                .status(401)
                .json({ message: "invalid user medication" });
        }
        const cartExist = yield cart_model_1.default.findOne({ userId: userId, userMedicationId: userMedicationId });
        if (cartExist) {
            return res
                .status(401)
                .json({ message: "medication already in cart list" });
        }
        const cart = new cart_model_1.default({
            userId,
            medicationId: userMedication.medicationId,
            userMedicationId: userMedicationId,
            quantityrquired: 1
        });
        yield cart.save();
        return res.status(200).json({
            message: "medication added to cart succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userAddMedicationToCartController = userAddMedicationToCartController;
//user increase medication  to cart/////////////
const userIncreaseMedicationToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const cartExist = yield cart_model_1.default.findOne({ _id: cartId, userId: userId });
        if (!cartExist) {
            return res
                .status(401)
                .json({ message: "medication not in cart list" });
        }
        cartExist.quantityrquired = cartExist.quantityrquired + 1;
        yield cartExist.save();
        return res.status(200).json({
            message: "medication increased in cart list succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userIncreaseMedicationToCartController = userIncreaseMedicationToCartController;
//user decrease medication  to cart/////////////
const userDecreaseMedicationToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const cartExist = yield cart_model_1.default.findOne({ _id: cartId, userId: userId });
        if (!cartExist) {
            return res
                .status(401)
                .json({ message: "medication not in cart list" });
        }
        cartExist.quantityrquired = cartExist.quantityrquired - 1;
        yield cartExist.save();
        const checkCartZero = yield cart_model_1.default.findOne({ _id: cartId, userId: userId });
        if ((checkCartZero === null || checkCartZero === void 0 ? void 0 : checkCartZero.quantityrquired) == 0) {
            yield cart_model_1.default.findOneAndDelete({ _id: cartId, userId: userId }, { new: true });
        }
        return res.status(200).json({
            message: "medication decreased in cart list succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userDecreaseMedicationToCartController = userDecreaseMedicationToCartController;
//user Remove medication  to cart/////////////
const userRemoveMedicationToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const deletedCart = yield cart_model_1.default.findOneAndDelete({ _id: cartId, userId: userId }, { new: true });
        if (!deletedCart) {
            return res
                .status(401)
                .json({ message: "medication not in cart list" });
        }
        return res.status(200).json({
            message: "medication remove from cart list succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userRemoveMedicationToCartController = userRemoveMedicationToCartController;
//user get all cartlist /////////////
const userCartListController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const cartList = yield cart_model_1.default.find({ userId });
        let cartLists = [];
        let overallCost = 0;
        for (let i = 0; i < cartList.length; i++) {
            const cart = cartList[i];
            const userMedication = yield medication_model_1.default.findOne({ _id: cart.userMedicationId, userId });
            const medication = yield medication_model_2.default.findOne({ _id: cart.medicationId });
            const price = medication === null || medication === void 0 ? void 0 : medication.price;
            const cartObj = {
                cartId: cart._id,
                medicationId: cart.medicationId,
                userMedicationId: cart.userMedicationId,
                name: medication === null || medication === void 0 ? void 0 : medication.name,
                ingridient: medication === null || medication === void 0 ? void 0 : medication.ingredient,
                price: medication === null || medication === void 0 ? void 0 : medication.price,
                form: medication === null || medication === void 0 ? void 0 : medication.form,
                dosage: medication === null || medication === void 0 ? void 0 : medication.strength,
                quantity: medication === null || medication === void 0 ? void 0 : medication.quantity,
                medicationImage: medication === null || medication === void 0 ? void 0 : medication.medicationImage,
                quantityrquired: cart.quantityrquired,
                totalCost: cart.quantityrquired * parseInt(price),
                refill: cart.refill,
            };
            cartLists.push(cartObj);
            const cost = cart.quantityrquired * parseInt(price);
            overallCost = overallCost + cost;
        }
        return res.status(200).json({
            cartLists,
            overallCost
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userCartListController = userCartListController;
//user change refill status of medication in cart/////////////
const userRefillStatusCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const cart = yield cart_model_1.default.findOne({ _id: cartId, userId: userId });
        if (!cart) {
            return res
                .status(401)
                .json({ message: "medication not in cart list" });
        }
        if (cart.refill == "no") {
            cart.refill = "yes";
        }
        else {
            cart.refill = "no";
        }
        yield cart.save();
        return res.status(200).json({
            message: "medication refill status change succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userRefillStatusCartController = userRefillStatusCartController;
