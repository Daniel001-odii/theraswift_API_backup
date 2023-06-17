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
exports.uncompletedOrdersControllers = exports.updateOrderStatus = exports.getUserOrders = exports.getOrders = exports.getOrderById = exports.addOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Order_model_1 = __importDefault(require("../models/Order.model"));
const Medications_model_1 = __importDefault(require("../models/Medications.model"));
const Prescription_model_1 = __importDefault(require("../models/Prescription.model"));
const Transactions_model_1 = __importDefault(require("../models/Transactions.model"));
const orderIdGenerator_1 = require("../utils/orderIdGenerator");
const awsS3_1 = require("../utils/awsS3");
const uuid_1 = require("uuid");
const User_model_1 = __importDefault(require("../models/User.model"));
const sendEmailUtility_1 = require("../utils/sendEmailUtility");
const ShippingAddress_model_1 = __importDefault(require("../models/ShippingAddress.model"));
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, products, prescription_input, prescription_id, delivery_time_chosen, payment, shipping_address, order_type, prescriptionCompleted, } = req.body;
        console.log("userId ", userId);
        // Check if the user exists in the database
        const existingUser = yield User_model_1.default.findOne({ userId });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists" });
        }
        // Validate the request body
        if (!userId ||
            !products ||
            !payment ||
            !shipping_address ||
            !delivery_time_chosen) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        // Check if the user's wallet balance is less than the payment amount
        if (parseInt(existingUser.theraWallet.toString()) <
            parseInt(payment.amount.toString())) {
            // If the user's balance is insufficient, return an error message
            return res.status(500).json({
                message: "You do not have enough balance to complete this order",
            });
        }
        // Validate the product IDs and quantities
        for (const { medication_id, quantity } of products) {
            let parsed_medication_id = new mongoose_1.default.Types.ObjectId(medication_id);
            console.log("medication_id ", medication_id);
            const medication = yield Medications_model_1.default.findById(parsed_medication_id);
            if (!medication) {
                return res
                    .status(400)
                    .json({ error: `Invalid medication ID: ${parsed_medication_id}` });
            }
            if (quantity <= 0) {
                return res
                    .status(400)
                    .json({ error: `Invalid medication quantity: ${quantity}` });
            }
        }
        if (prescription_id && prescription_input && req.file) {
            return res.status(400).json({
                error: `Invalid entry, only one from either prescription id, prescription input or prescription image can be accepted`,
            });
        }
        let existingPrescription;
        // Validate the prescription ID
        if (prescription_id) {
            let parsed_prescription_id = new mongoose_1.default.Types.ObjectId(prescription_id);
            existingPrescription = yield Prescription_model_1.default.findById(parsed_prescription_id);
            if (!existingPrescription) {
                return res
                    .status(400)
                    .json({ error: `Invalid prescription ID: ${prescription_id}` });
            }
        }
        // Validate the refill request ID
        // if (refill_request_id) {
        //   const existingRefillRequest = await RefillRequest.findById(refill_request_id);
        //   if (!existingRefillRequest) {
        //     return res.status(400).json({ error: `Invalid refill request ID: ${refill_request_id}` });
        //   }
        // }
        let savedPrescription;
        if (prescription_input) {
            const addPrescription = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const newPrescription = new Prescription_model_1.default({
                        userId,
                        type: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.type,
                        name: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.name,
                        strength: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.strength,
                        frequency: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.frequency,
                        startDate: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.startDate,
                        endDate: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.endDate,
                        doctor: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.doctor,
                        pharmacy: prescription_input === null || prescription_input === void 0 ? void 0 : prescription_input.pharmacy,
                    });
                    savedPrescription = yield (newPrescription === null || newPrescription === void 0 ? void 0 : newPrescription.save());
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({ message: "Error adding prescription", error });
                }
            });
            yield addPrescription();
        }
        let prescription_image_url = "";
        if (req.file) {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, awsS3_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            prescription_image_url = result.Location;
            const newPrescription = new Prescription_model_1.default({
                userId,
                prescriptionImageUrl: prescription_image_url,
            });
            savedPrescription = yield (newPrescription === null || newPrescription === void 0 ? void 0 : newPrescription.save());
        }
        let orderId = yield (0, orderIdGenerator_1.generateOrderId)();
        // Create a new Order document
        let newOrder;
        newOrder = new Order_model_1.default({
            userId,
            orderId,
            type: order_type,
            products,
            prescriptionId: existingPrescription ? (existingPrescription._id || null) : ((savedPrescription === null || savedPrescription === void 0 ? void 0 : savedPrescription._id) || null),
            payment,
            shipping_address,
            delivery_time_chosen,
            prescriptionCompleted,
        });
        if (!newOrder)
            return;
        let userTheraBalance = parseInt(existingUser.theraWallet.toString()) -
            parseInt(payment.amount.toString());
        existingUser.theraWallet = userTheraBalance;
        // update user balance after order
        yield existingUser.save();
        // Save the new Order document to the database
        let orderCreated = yield (newOrder === null || newOrder === void 0 ? void 0 : newOrder.save());
        // save the information to transaction history for user
        const newTransactionHistoryLog = new Transactions_model_1.default({
            userId,
            type: "medication-order",
            amount: payment.amount,
            details: {
                // orderId: orderCreated._id,
                orderId: orderCreated.orderId,
                amount: payment.amount,
                currency: "NGN",
                payment_status: "success",
                order_status: "pending",
                prescription: existingPrescription
                    ? existingPrescription === null || existingPrescription === void 0 ? void 0 : existingPrescription._id
                    : savedPrescription === null || savedPrescription === void 0 ? void 0 : savedPrescription._id,
                product_order_type: order_type,
            },
            created_at: new Date(),
        });
        let newTransactionHistory = yield newTransactionHistoryLog.save();
        // Return the new Order document
        res.status(201).json({ message: "order created successfully", newOrder });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
exports.addOrder = addOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { orderId } = req.body;
    try {
        let data = yield Order_model_1.default.findOne({ orderId });
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        // throw Error(error)
    }
});
exports.getOrderById = getOrderById;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield Order_model_1.default.find();
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        // throw Error(error)
    }
});
exports.getOrders = getOrders;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.body;
    try {
        let data = yield Order_model_1.default.find({ userId });
        res.status(200).json({ user_orders: data, message: "Orders retrieved successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        // throw Error(error)
    }
});
exports.getUserOrders = getUserOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { orderId, orderStatus } = req.body;
    try {
        const orderInfo = yield Order_model_1.default.findOne({ orderId });
        if (!orderInfo) {
            return res.status(404).send({ message: "Order not found " });
        }
        orderInfo.status = orderStatus;
        yield orderInfo.save();
        let existingUser;
        if (orderStatus === "cancelled") {
            let orderPrice = orderInfo.payment.amount;
            let userId = orderInfo.userId;
            // Check if the email already exists in the database
            existingUser = (yield User_model_1.default.findOne({ userId }));
            if (!existingUser) {
                return res.status(400).json({ message: "User does not exists" });
            }
            let newBalance = parseInt(existingUser.theraWallet.toString()) +
                parseInt(orderPrice.toString());
            existingUser.theraWallet = newBalance;
            yield existingUser.save();
        }
        // else if (orderStatus === "dispensed") {
        // }
        let senderEmailOrderStatusData = {
            firstName: `${existingUser.firstName}`,
            emailTo: existingUser.email,
            subject: "Therawallet Gift Balance Top-up Notification",
            orderStatus,
        };
        (0, sendEmailUtility_1.sendOrderStatusEmail)(senderEmailOrderStatusData);
        res.send({
            message: "Order updated status successfully",
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const uncompletedOrdersControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, user_id, finalize_status, prescription_id, delivery_time_chosen, street_address, street_number, shipping_address_id, } = req.body;
        // check if needed parameters are sent in the body
        if (!order_id || !user_id || !finalize_status)
            return res
                .status(400)
                .json({ message: "please send required body queries" });
        const orderInfo = yield Order_model_1.default.findOne({ orderId: order_id });
        if (!orderInfo)
            return res.status(404).json({ message: "order not found" });
        // Check if the user exists in the database
        const existingUser = yield User_model_1.default.findOne({ userId: user_id });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists" });
        }
        if (finalize_status === false) {
            orderInfo.status = "rejected";
            orderInfo.prescriptionCompleted = true;
            yield orderInfo.save();
            //TODO send mail to notify user of the rejected order
            let senderEmailOrderStatusData = {
                firstName: `${existingUser.firstName}`,
                emailTo: existingUser.email,
                subject: "Therawallet Rejected Order Notification",
                orderStatus: "rejected",
            };
            (0, sendEmailUtility_1.sendOrderStatusEmail)(senderEmailOrderStatusData);
            // mail the admin
            let senderEmailOrderCompletedData = {
                emailTo: existingUser.email,
                subject: "Therawallet Rejected Order Notification",
                orderId: orderInfo.orderId,
            };
            (0, sendEmailUtility_1.sendOrderCompleteEmail)(senderEmailOrderCompletedData);
            // save the information to transaction history for user
            const newTransactionHistoryLog = new Transactions_model_1.default({
                userId: user_id,
                type: "medication-order",
                amount: orderInfo.payment.amount,
                details: {
                    orderId: orderInfo.orderId,
                    amount: orderInfo.payment.amount,
                    currency: "NGN",
                    payment_status: "error",
                    order_status: "rejected",
                    prescription: prescription_id,
                    product_order_type: "prescription-order",
                },
                created_at: new Date(),
            });
            yield newTransactionHistoryLog.save();
            return res.json({ message: "Order rejected successfully" });
        }
        // continue order if not order is not rejected
        let newShippingAddress = {};
        if (street_address && street_number) {
            newShippingAddress = new ShippingAddress_model_1.default({
                userId: user_id,
                street_address,
                street_number,
            });
            yield newShippingAddress.save();
        }
        if (!(newShippingAddress === null || newShippingAddress === void 0 ? void 0 : newShippingAddress._id) || !shipping_address_id) {
            return res.json({ message: "please pass in shipping informations" });
        }
        // Check if the user's wallet balance is less than the payment amount
        if (parseInt(existingUser.theraWallet.toString()) <
            parseInt(orderInfo.payment.amount.toString())) {
            // If the user's balance is insufficient, return an error message
            return res.json({
                message: "You do not have enough balance to complete this order",
            });
        }
        let userTheraBalance = parseInt(existingUser.theraWallet.toString()) -
            parseInt(orderInfo.payment.amount.toString());
        existingUser.theraWallet = userTheraBalance;
        // update user balance after order
        yield existingUser.save();
        orderInfo.status = "dispensed";
        orderInfo.prescriptionCompleted = true;
        orderInfo.shipping_address = newShippingAddress
            ? newShippingAddress._id
            : shipping_address_id;
        orderInfo.delivery_time_chosen = delivery_time_chosen;
        yield orderInfo.save();
        // send mail to notify user of the dispensed order
        let senderEmailOrderStatusData = {
            firstName: `${existingUser.firstName}`,
            emailTo: existingUser.email,
            subject: "Therawallet Dispensed Order Notification",
            orderStatus: "dispensed",
        };
        (0, sendEmailUtility_1.sendOrderStatusEmail)(senderEmailOrderStatusData);
        // mail the admin
        let senderEmailOrderCompletedData = {
            emailTo: existingUser.email,
            subject: "Therawallet Completed Order Notification",
            // deliveryDate: "20/34/5",
            deliveryDate: delivery_time_chosen,
            orderId: orderInfo.orderId,
        };
        (0, sendEmailUtility_1.sendOrderCompleteEmail)(senderEmailOrderCompletedData);
        // save the information to transaction history for user
        const newTransactionHistoryLog = new Transactions_model_1.default({
            userId: user_id,
            type: "medication-order",
            amount: orderInfo.payment.amount,
            details: {
                orderId: orderInfo.orderId,
                amount: orderInfo.payment.amount,
                currency: "NGN",
                payment_status: "success",
                order_status: "dispensed",
                prescription: prescription_id,
                product_order_type: "prescription-order",
                shipping_address: newShippingAddress
                    ? newShippingAddress._id
                    : shipping_address_id,
            },
            created_at: new Date(),
        });
        yield newTransactionHistoryLog.save();
        return res.json({ message: "Order dispensed successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.uncompletedOrdersControllers = uncompletedOrdersControllers;
