"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    streetNO: {
        type: String,
        required: true,
    },
    LGA: {
        type: String,
        required: true,
    },
    DeliveryInstruction: {
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
const UserAddressModel = (0, mongoose_1.model)("UserAddress", AddressSchema);
exports.default = UserAddressModel;
