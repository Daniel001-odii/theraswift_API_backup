"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RemoveMedicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    medicationId: {
        type: String,
        require: true
    },
    reason: {
        type: String,
        require: true
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
const RemoveMedicationModel = (0, mongoose_1.model)("RemoveMedication", RemoveMedicationSchema);
exports.default = RemoveMedicationModel;
