"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeliverSchema = new mongoose_1.Schema({
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DriverReg',
    },
    userId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    enoughFuel: {
        type: String,
        enum: ["yes", "no"],
    },
    phoneCharge: {
        type: String,
        enum: ["yes", "no"],
    },
    theraswitId: {
        type: String,
        enum: ["yes", "no"],
    },
    deliveredStatus: {
        type: String,
        enum: ["initiate", "pickup", "startTrip", "delivered", "comfirmDelivered"],
    },
    deliveredImage: {
        type: String,
        default: '',
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
const DeliverModel = (0, mongoose_1.model)("Deliver", DeliverSchema);
exports.default = DeliverModel;
