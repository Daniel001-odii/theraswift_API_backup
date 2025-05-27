"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeliverSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
    },
    medicationId: String,
    amount: Number,
    address: String,
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DriverReg',
    },
    deliveredStatus: {
        type: String,
        enum: ["initiate", "pickup", "startTrip", "delivered", "comfirmDelivered"],
    },
    prescriber: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg',
    }
}, {
    timestamps: true,
});
const MedicationDeliveryModel = (0, mongoose_1.model)("MedicationDelivery", DeliverSchema);
exports.default = MedicationDeliveryModel;
