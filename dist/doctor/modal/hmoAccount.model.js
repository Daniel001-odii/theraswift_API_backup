"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HmoAccountSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        default: 0,
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg'
    },
    clinicCode: {
        type: String,
    },
    patientId: {
        type: String,
    },
    medicationId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["cleared", "not cleared"]
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
const HmoAccountModel = (0, mongoose_1.model)("HmoAccount", HmoAccountSchema);
exports.default = HmoAccountModel;
