"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicationSchema = new mongoose_1.Schema({
    meidcationId: String,
    name: String,
    form: String,
    dosage: String,
    quantity: String,
    price: String,
    orderQuantity: Number,
    refill: String
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
    deliveryDate: {
        type: String,
    },
    refererBunousUsed: {
        type: String,
    },
    totalAmount: {
        type: String,
    },
    amountPaid: {
        type: String,
    },
    paymentDate: {
        type: String,
    },
    deliveredStatus: {
        type: String,
        enum: ["delivered", "pending", "not delivered"],
    },
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
const OrderModel = (0, mongoose_1.model)("Order", OrderSchema);
exports.default = OrderModel;
