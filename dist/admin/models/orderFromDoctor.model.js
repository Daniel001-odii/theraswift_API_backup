"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicationSchema = new mongoose_1.Schema({
    meidcationId: String,
    name: String,
    form: String,
    strength: String,
    quantity: String,
    price: String,
    orderQuantity: Number,
    dosage: String,
    frequency: Number,
    route: String,
    duration: String,
});
const OrderSchema = new mongoose_1.Schema({
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'PatientReg',
        required: true,
    },
    doctortId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'DoctorReg',
        required: true,
    },
    clinicCode: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
    },
    medications: [medicationSchema],
    deliveryDate: {
        type: String,
    },
    totalAmount: {
        type: String,
    },
    amountPaid: {
        type: String,
    },
    paymentDate: {
        type: String,
    },
    methodOfPaymen: {
        type: String,
        enum: ["HMO", "pocket"],
        required: true,
    },
    hmoName: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "paid", "delivered"],
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
const OrderFormDoctorModel = (0, mongoose_1.model)("OrderFromDoctor", OrderSchema);
exports.default = OrderFormDoctorModel;
