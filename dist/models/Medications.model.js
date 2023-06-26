"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define medication schema
const medicationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    strength: {
        type: String,
        // required: true,
    },
    warnings: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    image_url: {
        type: String,
    },
    price: {
        type: Number,
        required: false,
    },
    available: {
        type: Boolean,
        default: true,
    },
    sideEffects: {
        type: [String],
    },
    ingredients: {
        type: [String],
    },
    storageInstructions: {
        type: String,
    },
    contraindications: {
        type: [String],
    },
    routeOfAdministration: {
        type: String,
    },
    prescription_required_type: {
        type: String,
    },
    type: {
        type: String,
    },
    medicationForms: {
        type: [String],
    },
    medicationTypes: {
        type: [String],
    },
    essential_category: {
        type: String,
    },
    quantity: {
        type: String
    }
});
// Define medication model
const Medication = (0, mongoose_1.model)("Medications", medicationSchema);
// Export Medication model for use in other modules
exports.default = Medication;
