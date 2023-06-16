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
        required: true,
    },
    products: [
        {
            medication_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Medications",
                required: false,
            },
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
    refill_request_id: {
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
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
        required: true,
    },
    shipping_address: {
        type: String,
        required: true,
    },
    deliver_time: {
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
    dispenseInfo: {}
}, {
    timestamps: true,
});
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
