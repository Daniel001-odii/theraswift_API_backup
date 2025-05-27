"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserMedicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    medicationId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Medication',
        required: true,
    },
    prescriptionStatus: {
        type: Boolean,
        required: true,
        default: true
    },
    prescriptionImage: {
        type: String,
        default: "",
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
    },
    clinicCode: {
        type: String,
        default: "",
    },
    /*
      new fields for more details [dan_]...
    */
    last_filled_date: {
        type: Date,
        default: Date.now()
    },
    refills_left: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["processing order", "working wit HMO/insurance", "delivered"],
        default: "processing order"
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
const UserMedicationModel = (0, mongoose_1.model)("UserMedication", UserMedicationSchema);
exports.default = UserMedicationModel;
