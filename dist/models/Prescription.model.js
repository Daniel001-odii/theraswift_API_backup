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
    type: { type: String, enum: Object.values(PrescriptionType), required: false },
    name: { type: String, required: false },
    strength: { type: String, required: false },
    frequency: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    doctor: Object,
    pharmacy: Object,
    prescriptionImageUrl: String
});
let PrescriptionModel = (0, mongoose_1.model)("Prescription", prescriptionSchema);
exports.default = PrescriptionModel;
