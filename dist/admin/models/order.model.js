"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicationSchema = new mongoose_1.Schema({
    medication: mongoose_1.Schema.Types.Mixed,
    orderQuantity: Number,
    refill: String
});
const EnsentailSchema = new mongoose_1.Schema({
    product: mongoose_1.Schema.Types.Mixed,
    orderQuantity: Number,
    refill: String,
});
const OrderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    paymentId: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    address: {
        type: String,
    },
    medications: [medicationSchema],
    ensential: [EnsentailSchema],
    deliveryDate: {
        type: String,
    },
    refererBunousUsed: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    amountPaid: {
        type: Number,
    },
    paymentDate: {
        type: String,
    },
    deliveredStatus: {
        type: String,
        enum: ["delivered", "pending", "not delivered"],
    },
    orderId: {
        type: String,
        default: ''
    },
    others: [
        {
            key: String,
            value: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const OrderModel = (0, mongoose_1.model)("OrderReg", OrderSchema);
exports.default = OrderModel;
