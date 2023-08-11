"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: false,
    },
    products: [
        {
            medication: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Medications",
                required: false,
            },
            medicationForm: String,
            medicationStrength: String,
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    prescriptionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Prescription",
    },
    refillRequestId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "RefillRequest",
    },
    payment: {
        type: {
            provider: {
                type: String,
                enum: ["paystack", "flutterwave", "stripe", 'medwallet'],
                required: true,
            },
            transaction_id: {
                type: String,
                required: false,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
        required: true,
    },
    shippingAddress: {
        type: {},
        required: true,
    },
    deliverTime: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "cancelled", "dispensed", "delivered", "rejected"],
        default: "pending",
    },
    prescriptionCompleted: {
        type: Boolean,
        default: true
    },
    // dispenseInfo:{
    // }
}, {
    timestamps: true,
});
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
