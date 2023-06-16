"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionType = void 0;
const mongoose_1 = require("mongoose");
var PrescriptionType;
(function (PrescriptionType) {
    PrescriptionType["DoctorPrescription"] = "doctor-prescription";
    PrescriptionType["PharmacyPrescription"] = "pharmacy-prescription";
    PrescriptionType["NonPrescription"] = "non-prescription";
})(PrescriptionType = exports.PrescriptionType || (exports.PrescriptionType = {}));
const prescriptionSchema = new mongoose_1.Schema({
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    // },
    userId: {
        type: String,
        required: true,
    },
    type: { type: String, enum: Object.values(PrescriptionType), required: true },
    name: { type: String, required: true },
    strength: { type: String, required: true },
    frequency: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    doctor: Object,
    pharmacy: Object,
    prescriptionImageUrl: String
});
let PrescriptionModel = (0, mongoose_1.model)("Prescription", prescriptionSchema);
exports.default = PrescriptionModel;
