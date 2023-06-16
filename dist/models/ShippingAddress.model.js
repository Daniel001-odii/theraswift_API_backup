"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shippingAddressSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    street_address: {
        type: String,
        required: true,
    },
    street_number: {
        type: String,
        required: false,
    },
    delivery_instruction: {
        type: String,
        required: false,
    },
    leave_with_doorman: {
        type: String,
        required: false,
    },
    lga: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const shippingAddressModel = (0, mongoose_1.model)("Shipping_address", shippingAddressSchema);
exports.default = shippingAddressModel;
