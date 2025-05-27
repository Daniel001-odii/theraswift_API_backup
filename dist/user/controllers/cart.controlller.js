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
exports.userClearCartlistController = exports.userRefillStatusCartController = exports.userCartListController = exports.userRemoveMedicationToCartController = exports.userDecreaseMedicationToCartController = exports.userIncreaseMedicationToCartController = exports.userAddMedicationToCartController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const medication_model_1 = __importDefault(require("../models/medication.model"));
const medication_model_2 = __importDefault(require("../../admin/models/medication.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const essentialProduct_model_1 = __importDefault(require("../../admin/models/essentialProduct.model"));
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
        let madicationAvailable = false;
        let medicationId = '';
        let patientMedicationId = '';
        console.log(1);
        //get user medication
        const userMedication = yield medication_model_1.default.findOne({ _id: userMedicationId });
        console.log(2);
        if (userMedication) {
            madicationAvailable = true;
            medicationId = userMedication.medicationId;
            patientMedicationId = userMedicationId;
            console.log(3);
        }
        //get  medication
        const medication = yield medication_model_2.default.findOne({ _id: userMedicationId });
        console.log(4);
        if (medication) {
            madicationAvailable = true;
            medicationId = userMedicationId;
            patientMedicationId = 'not in medication';
            console.log(5);
        }
        if (!madicationAvailable) {
            return res
                .status(401)
                .json({ message: "invalid user medication or medication not found" });
        }
        console.log(6);
        const cartExist = yield cart_model_1.default.findOne({ userId: userId, medicationId: medicationId });
        console.log(7);
        if (cartExist) {
            return res
                .status(401)
                .json({ message: "medication already in cart list" });
        }
        console.log(9);
        const cart = new cart_model_1.default({
            userId,
            medicationId: medicationId,
            userMedicationId: patientMedicationId,
            quantityrquired: 1,
            type: "med"
        });
        console.log(10);
        const saveCart = yield cart.save();
        console.log(11);
        return res.status(200).json({
            message: "medication added to cart succefully",
            data: saveCart
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
        console.log(1);
        const cartList = yield cart_model_1.default.find({ userId });
        let cartLists = [];
        let overallCost = 0;
        let product;
        console.log(2);
        for (let i = 0; i < cartList.length; i++) {
            const cart = cartList[i];
            console.log(3);
            if (cart.type == "med") {
                // const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId});
                console.log(14);
                const medication = yield medication_model_2.default.findOne({ _id: cart.medicationId });
                console.log(4);
                if (!medication) {
                    continue;
                }
                const cost = cart.quantityrquired * medication.price;
                overallCost = overallCost + cost;
                console.log(5);
                product = medication;
            }
            else if (cart.type == "ess") {
                console.log(6);
                const essentialProduct = yield essentialProduct_model_1.default.findOne({ _id: cart.productId });
                console.log(7);
                if (!essentialProduct) {
                    continue;
                }
                console.log(8);
                const cost = cart.quantityrquired * parseFloat(essentialProduct.price);
                overallCost = overallCost + cost;
                product = essentialProduct;
                console.log(9);
            }
            else {
                continue;
            }
            const cartObj = {
                cart,
                product
            };
            console.log(10);
            cartLists.push(cartObj);
        }
        console.log(11);
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
        const { cartId, } = req.query;
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
//user clear cart listn/////////////
const userClearCartlistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        //const deletedCart = await CartModel.findOneAndDelete({_id: cartId, userId: userId}, {new: true});
        const clearCart = yield cart_model_1.default.deleteMany({ userId: { $in: userId } });
        return res.status(200).json({
            message: "cart list cleared successfully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userClearCartlistController = userClearCartlistController;
