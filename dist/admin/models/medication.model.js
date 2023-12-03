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
    strength: {
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
    medInfo: {
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
const MedicationModel = (0, mongoose_1.model)("Medication", MedicationSchema);
exports.default = MedicationModel;
