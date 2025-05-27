"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["success", "pending", "declined"],
        required: true,
    },
    transactionType: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
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
const TransactionMoel = (0, mongoose_1.model)("Transaction", TransactionSchema);
exports.default = TransactionMoel;
