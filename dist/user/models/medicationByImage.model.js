"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PatientMedicationImageSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    patientMedicationImage: {
        type: String,
        default: "",
    },
    enter: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
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
const PatientMedicationImageModel = (0, mongoose_1.model)("PatientMedicationImage", PatientMedicationImageSchema);
exports.default = PatientMedicationImageModel;
