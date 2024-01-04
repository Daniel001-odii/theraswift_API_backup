"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EssentialProductSchema = new mongoose_1.Schema({
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'EssentialCategory',
        required: true,
    },
    name: {
        type: String,
    },
    price: {
        type: String,
    },
    uses: {
        type: String,
    },
    quantity: {
        type: String,
    },
    medicationImage: {
        type: String,
    },
    inventoryQauntity: {
        type: String,
    },
    ingredient: {
        type: String,
    },
    expiryDate: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        default: "",
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
const EssentialProductModel = (0, mongoose_1.model)("EssentialProduct", EssentialProductSchema);
exports.default = EssentialProductModel;
