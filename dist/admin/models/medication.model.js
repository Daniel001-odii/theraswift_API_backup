"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MedicationSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    price: {
        type: String,
    },
    quantity: {
        type: String,
    },
    medicationImage: {
        type: String,
    },
    prescriptionRequired: {
        type: String,
        enum: ["required", "not required", "neccessary"],
    },
    form: {
        type: String,
    },
    ingredient: {
        type: String,
    },
    quantityForUser: {
        type: String,
    },
    inventoryQuantity: {
        type: String,
    },
    expiredDate: {
        type: String,
    },
    category: {
        type: String,
    },
    medInfo: {
        overView: String,
        howToUse: String,
        sideEffect: String,
        storage: String,
        drugInteraction: String,
        overdose: String,
        more: String,
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
const MedicationModel = (0, mongoose_1.model)("Medication", MedicationSchema);
exports.default = MedicationModel;
