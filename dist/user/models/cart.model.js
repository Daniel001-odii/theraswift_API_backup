"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CartSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    medicationId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Medication',
        required: true,
    },
    userMedicationId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserMedication',
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
const CartModel = (0, mongoose_1.model)("Cart", CartSchema);
exports.default = CartModel;
