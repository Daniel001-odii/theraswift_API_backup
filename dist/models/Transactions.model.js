"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    userId: String,
    type: {
        type: String,
        enum: ['gift-balance', 'product-order', 'wallet-topup', 'medication-order']
    },
    details: Object,
    amount: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true,
});
const TransactionsModel = (0, mongoose_1.model)("Transactions", TransactionSchema);
exports.default = TransactionsModel;
