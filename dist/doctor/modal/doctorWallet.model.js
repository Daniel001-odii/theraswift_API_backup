"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DoctorWalletSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        default: 0,
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg'
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
const DoctorWalletModel = (0, mongoose_1.model)("DoctorWallet", DoctorWalletSchema);
exports.default = DoctorWalletModel;
