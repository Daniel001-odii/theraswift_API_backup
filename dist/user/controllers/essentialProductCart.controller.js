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
exports.getEssentialProductInCartController = exports.decreaseEssentialProductToCartController = exports.increaseEssentialProductToCartController = exports.addEssentialProductToCartController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const ensentialCart_model_1 = __importDefault(require("../models/ensentialCart.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
// add esential product to cart /////////////
const addEssentialProductToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
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
        const checkCart = yield cart_model_1.default.findOne({ userId, productId });
        if (checkCart) {
            checkCart.quantityrquired = checkCart.quantityrquired + 1;
            yield checkCart.save();
            return res.status(200).json({
                message: "product added to cart succefully",
            });
        }
        else {
            const newCart = new cart_model_1.default({
                userId,
                productId,
                quantityrquired: 1,
                type: "ess"
            });
            yield newCart.save();
            return res.status(200).json({
                message: "product added to cart succefully",
            });
        }
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.addEssentialProductToCartController = addEssentialProductToCartController;
// increase esential product to cart /////////////
const increaseEssentialProductToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { enssentialCartId } = req.body;
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
        const checkCart = yield ensentialCart_model_1.default.findOne({ _id: enssentialCartId, userId });
        if (!checkCart) {
            return res
                .status(401)
                .json({ message: "invalid cart ID" });
        }
        checkCart.quantityrquired = checkCart.quantityrquired + 1;
        yield checkCart.save();
        return res.status(200).json({
            message: "product increase in cart succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.increaseEssentialProductToCartController = increaseEssentialProductToCartController;
// decrease esential product to cart /////////////
const decreaseEssentialProductToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { enssentialCartId } = req.body;
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
        const checkCart = yield ensentialCart_model_1.default.findOne({ _id: enssentialCartId, userId });
        if (!checkCart) {
            return res
                .status(401)
                .json({ message: "invalid cart ID" });
        }
        checkCart.quantityrquired = checkCart.quantityrquired - 1;
        const decreaseCart = yield checkCart.save();
        if (decreaseCart.quantityrquired == 0) {
            yield ensentialCart_model_1.default.findOneAndDelete({ _id: enssentialCartId, userId }, { new: true });
        }
        return res.status(200).json({
            message: "product decrease in cart succefully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.decreaseEssentialProductToCartController = decreaseEssentialProductToCartController;
// get esential product in cart /////////////
const getEssentialProductInCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // const carts = await EssentialCart.find({userId})
        // .populate('productId', 'firstName surname email phoneNumber gender dateOFBirth address');
        const carts = yield ensentialCart_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'EssentialProduct',
                    //localField: 'referenceId',
                    localField: 'referenceId',
                    foreignField: '_id',
                    as: 'product',
                },
            },
        ]);
        return res.status(200).json({
            carts
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getEssentialProductInCartController = getEssentialProductInCartController;
