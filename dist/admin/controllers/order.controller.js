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
exports.DeliveredOrderController = exports.getPageOrderNotpendingController = exports.getSingleOrderDeliveredController = exports.getPageOrderDeliveredController = exports.getAllOrderDeliveredController = exports.getSingleOrderNotDeliveredController = exports.getPageOrderNotDeliveredController = exports.getAllOrderNotDeliveredController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../../user/models/userReg.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
//get all order not deliver /////////////
const getAllOrderNotDeliveredController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const orders = yield order_model_1.default.find({ deliveredStatus: "not delivered" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        ;
        let orderArry = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const user = yield userReg_model_1.default.findOne({ _id: order.userId });
            const orderObj = {
                orderId: order._id,
                id: user === null || user === void 0 ? void 0 : user._id,
                userId: user === null || user === void 0 ? void 0 : user.userId,
                email: user === null || user === void 0 ? void 0 : user.email,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
                gender: user === null || user === void 0 ? void 0 : user.gender,
                order
            };
            orderArry.push(orderObj);
        }
        return res.status(200).json({
            message: "success",
            users: orderArry
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getAllOrderNotDeliveredController = getAllOrderNotDeliveredController;
//get all page order not deliver /////////////
const getPageOrderNotDeliveredController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalOrders = yield order_model_1.default.countDocuments({ deliveredStatus: "not delivered" }); // Get the total number of documents
        const orders = yield order_model_1.default.find({ deliveredStatus: "not delivered" }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        let orderArry = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const user = yield userReg_model_1.default.findOne({ _id: order.userId });
            const orderObj = {
                orderId: order._id,
                id: user === null || user === void 0 ? void 0 : user._id,
                userId: user === null || user === void 0 ? void 0 : user.userId,
                email: user === null || user === void 0 ? void 0 : user.email,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
                gender: user === null || user === void 0 ? void 0 : user.gender,
                order
            };
            orderArry.push(orderObj);
        }
        return res.status(200).json({
            message: "success",
            orders: orderArry,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getPageOrderNotDeliveredController = getPageOrderNotDeliveredController;
//get single order not deliver /////////////
const getSingleOrderNotDeliveredController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const order = yield order_model_1.default.findOne({ _id: orderId, deliveredStatus: "not delivered" });
        if (!order) {
            return res.status(401).json({ message: "incorrect Order ID." });
        }
        const user = yield userReg_model_1.default.findOne({ _id: order === null || order === void 0 ? void 0 : order.userId });
        const orderObj = {
            orderId: order === null || order === void 0 ? void 0 : order._id,
            id: user === null || user === void 0 ? void 0 : user._id,
            userId: user === null || user === void 0 ? void 0 : user.userId,
            email: user === null || user === void 0 ? void 0 : user.email,
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
            gender: user === null || user === void 0 ? void 0 : user.gender,
            order
        };
        return res.status(200).json({
            message: "success",
            order: orderObj
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getSingleOrderNotDeliveredController = getSingleOrderNotDeliveredController;
//get all order  delivered /////////////
const getAllOrderDeliveredController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find({ deliveredStatus: "delivered" }).sort({ createdAt: -1 });
        let orderArry = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const user = yield userReg_model_1.default.findOne({ _id: order.userId });
            const orderObj = {
                orderId: order._id,
                id: user === null || user === void 0 ? void 0 : user._id,
                userId: user === null || user === void 0 ? void 0 : user.userId,
                email: user === null || user === void 0 ? void 0 : user.email,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
                gender: user === null || user === void 0 ? void 0 : user.gender,
                order
            };
            orderArry.push(orderObj);
        }
        return res.status(200).json({
            message: "success",
            orders: orderArry
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getAllOrderDeliveredController = getAllOrderDeliveredController;
//get page order delivered /////////////
const getPageOrderDeliveredController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 10; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalOrders = yield order_model_1.default.countDocuments({ deliveredStatus: "delivered" }); // Get the total number of documents
        const orders = yield order_model_1.default.find({ deliveredStatus: "delivered" }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        let orderArry = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const user = yield userReg_model_1.default.findOne({ _id: order.userId });
            const orderObj = {
                orderId: order._id,
                id: user === null || user === void 0 ? void 0 : user._id,
                userId: user === null || user === void 0 ? void 0 : user.userId,
                email: user === null || user === void 0 ? void 0 : user.email,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
                gender: user === null || user === void 0 ? void 0 : user.gender,
                order
            };
            orderArry.push(orderObj);
        }
        return res.status(200).json({
            message: "success",
            orders: orderArry,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getPageOrderDeliveredController = getPageOrderDeliveredController;
//get single order delivered /////////////
const getSingleOrderDeliveredController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const order = yield order_model_1.default.findOne({ _id: orderId, deliveredStatus: "delivered" });
        if (!order) {
            return res.status(401).json({ message: "incorrect Order ID." });
        }
        const user = yield userReg_model_1.default.findOne({ _id: order === null || order === void 0 ? void 0 : order.userId });
        const orderObj = {
            orderId: order === null || order === void 0 ? void 0 : order._id,
            id: user === null || user === void 0 ? void 0 : user._id,
            userId: user === null || user === void 0 ? void 0 : user.userId,
            email: user === null || user === void 0 ? void 0 : user.email,
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
            gender: user === null || user === void 0 ? void 0 : user.gender,
            order
        };
        return res.status(200).json({
            message: "success",
            order: orderObj
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getSingleOrderDeliveredController = getSingleOrderDeliveredController;
//get all page order pending /////////////
const getPageOrderNotpendingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalOrders = yield order_model_1.default.countDocuments({ deliveredStatus: "pending" }); // Get the total number of documents
        const orders = yield order_model_1.default.find({ deliveredStatus: "pending" }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        let orderArry = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const user = yield userReg_model_1.default.findOne({ _id: order.userId });
            const orderObj = {
                orderId: order._id,
                id: user === null || user === void 0 ? void 0 : user._id,
                userId: user === null || user === void 0 ? void 0 : user.userId,
                email: user === null || user === void 0 ? void 0 : user.email,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
                gender: user === null || user === void 0 ? void 0 : user.gender,
                order
            };
            orderArry.push(orderObj);
        }
        return res.status(200).json({
            message: "success",
            orders: orderArry,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getPageOrderNotpendingController = getPageOrderNotpendingController;
// add press delivered order /////////////
const DeliveredOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const order = yield order_model_1.default.findOne({ _id: orderId, deliveredStatus: "not delivered" });
        if (!order) {
            return res.status(401).json({ message: "incorrect Order ID." });
        }
        order.deliveredStatus = "delivered";
        const orderDelivered = yield order.save();
        const user = yield userReg_model_1.default.findOne({ _id: order === null || order === void 0 ? void 0 : order.userId });
        const orderObj = {
            orderId: order === null || order === void 0 ? void 0 : order._id,
            id: user === null || user === void 0 ? void 0 : user._id,
            userId: user === null || user === void 0 ? void 0 : user.userId,
            email: user === null || user === void 0 ? void 0 : user.email,
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            mobileNumber: user === null || user === void 0 ? void 0 : user.mobileNumber,
            gender: user === null || user === void 0 ? void 0 : user.gender,
            order
        };
        return res.status(200).json({
            message: "order Successfully delivered",
            order: orderObj
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.DeliveredOrderController = DeliveredOrderController;
