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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, products, prescription_input, prescription_id, delivery_time_chosen, payment, shipping_address, order_type, prescriptionCompleted, profile_info } = req.body;
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
            prescription_image_url = result === null || result === void 0 ? void 0 : result.Location;
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
            prescriptionId: existingPrescription
                ? existingPrescription._id || null
                : (savedPrescription === null || savedPrescription === void 0 ? void 0 : savedPrescription._id) || null,
            payment,
            shipping_address,
            delivery_time: delivery_time_chosen,
            prescriptionCompleted,
            profile_info
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
                orderId: orderCreated.orderId,
                amount: payment.amount,
                currency: "NGN",
                payment_status: "success",
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
    let { orderId } = req.params;
    try {
        let data = yield Order_model_1.default.findOne({ orderId }).populate({
            path: "products.medication",
            select: "-_id -medicationForms -medicationTypes",
        });
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getOrderById = getOrderById;
const getOrders = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield Order_model_1.default.find().populate({
                path: "products.medication",
                select: "-_id -medicationForms -medicationTypes",
            });
            res.status(200).json({ data: orders });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
exports.getOrders = getOrders;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = process.env.JWT_SECRET_KEY;
        // Get JWT from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const { userId } = jsonwebtoken_1.default.verify(token, secret);
        const userOrders = yield Order_model_1.default.find({ userId }).populate({
            path: "products.medication",
            select: "-_id -medicationForms -medicationTypes",
        });
        res
            .status(200)
            .json({
            user_orders: userOrders,
            message: "Orders retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
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
        if (!orderStatus) {
            return res.status(404).send({ message: "Order status not found " });
        }
        orderInfo.status = orderStatus;
        let existingUser;
        let userId = orderInfo.userId;
        // Check if the email already exists in the database
        existingUser = (yield User_model_1.default.findOne({ userId }));
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists" });
        }
        yield orderInfo.save();
        if (orderStatus === "cancelled" || orderStatus === "rejected") {
            let orderPrice = orderInfo.payment.amount;
            let newBalance = parseInt(existingUser.theraWallet.toString()) +
                parseInt(orderPrice.toString());
            existingUser.theraWallet = newBalance;
            yield existingUser.save();
        }
        else if (orderStatus === "dispensed") {
            //INFO: There is no need in to do anything here as the order status has been updated before anything above. the "if(){}" block is needed to return the users money and update user balance by returning their money to their balance.
        }
        let senderEmailOrderStatusData = {
            firstName: `${existingUser.firstName}`,
            emailTo: existingUser.email,
            subject: "Theraswift Order status update Notification",
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
// INFO: this to make users to either accept or cancel the prescription invoice sent from the admin
const uncompletedOrdersControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, userId, finalizeStatus, prescriptionId, deliveryTimeChosen, streetAddress, streetNumber, shippingAddressId, } = req.body;
        // check if needed parameters are sent in the body
        if (!orderId || !userId || !finalizeStatus)
            return res
                .status(400)
                .json({ message: "please send required body queries" });
        const orderInfo = yield Order_model_1.default.findOne({ orderId: orderId });
        if (!orderInfo)
            return res.status(404).json({ message: "order not found" });
        // Check if the user exists in the database
        const existingUser = yield User_model_1.default.findOne({ userId: userId });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists" });
        }
        if (finalizeStatus === 'cancelled') {
            orderInfo.status = "cancelled";
            orderInfo.prescriptionCompleted = true;
            yield orderInfo.save();
            //INFO: send mail to notify user of the rejected order
            let senderEmailOrderStatusData = {
                firstName: `${existingUser.firstName}`,
                emailTo: existingUser.email,
                subject: "Theraswift Cancelled Order Notification",
                orderStatus: "cancelled",
            };
            (0, sendEmailUtility_1.sendOrderStatusEmail)(senderEmailOrderStatusData);
            // mail the admin
            let senderEmailOrderCompletedData = {
                emailTo: existingUser.email,
                subject: "Theraswift Cancelled Order Notification",
                orderId: orderInfo.orderId,
            };
            (0, sendEmailUtility_1.sendOrderCompleteEmail)(senderEmailOrderCompletedData);
            // save the information to transaction history for user
            const newTransactionHistoryLog = new Transactions_model_1.default({
                userId,
                type: "medication-order",
                amount: orderInfo.payment.amount,
                details: {
                    orderId: orderInfo.orderId,
                },
                created_at: new Date(),
            });
            yield newTransactionHistoryLog.save();
            return res.json({ message: "Order rejected successfully" });
        }
        //INFO: continue code execution order if not order is not rejected
        let newShippingAddress = {};
        if (streetAddress && streetNumber) {
            newShippingAddress = new ShippingAddress_model_1.default({
                userId,
                street_address: streetNumber,
                street_number: streetNumber,
            });
            yield newShippingAddress.save();
        }
        if (!(newShippingAddress === null || newShippingAddress === void 0 ? void 0 : newShippingAddress._id) || !shippingAddressId) {
            return res.json({ message: "please pass in one shipping information" });
        }
        //INFO: Check if the user's wallet balance is less than the payment amount
        if (parseInt(existingUser.theraWallet.toString()) <
            parseInt(orderInfo.payment.amount.toString())) {
            //INFO: If the user's balance is insufficient, return an error message
            return res.json({
                message: "You do not have enough balance to complete this order",
            });
        }
        let userTheraBalance = parseInt(existingUser.theraWallet.toString()) -
            parseInt(orderInfo.payment.amount.toString());
        existingUser.theraWallet = userTheraBalance;
        //INFO: update user balance after order to reduce user's balance.
        yield existingUser.save();
        orderInfo.status = "dispensed";
        orderInfo.prescriptionCompleted = true;
        orderInfo.shippingAddress = newShippingAddress
            ? newShippingAddress._id
            : shippingAddressId;
        orderInfo.deliveryTime = deliveryTimeChosen;
        yield orderInfo.save();
        //INFO: send mail to notify user of the dispensed order
        let senderEmailOrderStatusData = {
            firstName: `${existingUser.firstName}`,
            emailTo: existingUser.email,
            subject: "Theraswift Dispensed Order Notification",
            orderStatus: "dispensed",
        };
        (0, sendEmailUtility_1.sendOrderStatusEmail)(senderEmailOrderStatusData);
        //INFO: send mail to notify admin of the dispensed order
        let senderEmailOrderCompletedData = {
            emailTo: existingUser.email,
            subject: "Therawswift Completed Order Notification",
            deliveryDate: deliveryTimeChosen,
            orderId: orderInfo.orderId,
        };
        (0, sendEmailUtility_1.sendOrderCompleteEmail)(senderEmailOrderCompletedData);
        // save the information to transaction history for user
        const newTransactionHistoryLog = new Transactions_model_1.default({
            userId,
            type: "medication-order",
            amount: orderInfo.payment.amount,
            details: {
                orderId: orderInfo.orderId,
                amount: orderInfo.payment.amount,
                currency: "NGN",
                payment_status: "success",
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
