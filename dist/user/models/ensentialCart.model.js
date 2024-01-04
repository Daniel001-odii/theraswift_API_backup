"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EnsentialCartSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'EssentialProduct',
        required: true,
    },
    quantityrquired: {
        type: Number,
        required: true,
    },
    refill: {
        type: String,
        default: "no",
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
const EnsentialCartModel = (0, mongoose_1.model)("EnsentialCart", EnsentialCartSchema);
exports.default = EnsentialCartModel;
