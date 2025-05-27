"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGetPatientOrderSentToHmo = exports.adminSendingPatientOrderToHmo = void 0;
const express_validator_1 = require("express-validator");
const patient_reg_model_1 = __importDefault(require("../../doctor/modal/patient_reg.model"));
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
const patientOrder_model_1 = __importDefault(require("../../doctor/modal/patientOrder.model"));
// admin send doctor order to hmo
const adminSendingPatientOrderToHmo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { patientId, hmoClinicCode } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const patient = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patient) {
            return res
                .status(401)
                .json({ message: "incorrect patient ID" });
        }
        const hmo = yield doctor_reg_modal_1.default.find({ clinicCode: hmoClinicCode });
        if (hmo.length < 1) {
            return res
                .status(401)
                .json({ message: "HMO not avialable" });
        }
        const orders = yield patientOrder_model_1.default.find({ patientId: patient._id, status: "pending", toHmo: "yes", hmoState: "admin" });
        if (orders.length < 1) {
            return res
                .status(401)
                .json({ message: "no order for hmo for this particular patient" });
        }
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const singleOrder = yield patientOrder_model_1.default.findOne({ _id: order._id });
            if (!singleOrder)
                continue;
            singleOrder.hmoState = "hmo";
            yield singleOrder.save();
        }
        return res.status(200).json({
            message: 'order successfully sent to HMO'
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminSendingPatientOrderToHmo = adminSendingPatientOrderToHmo;
// admin get patient order sent to hmo
const adminGetPatientOrderSentToHmo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { patientId, } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const patient = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patient) {
            return res
                .status(401)
                .json({ message: "incorrect patient ID" });
        }
        const orders = yield patientOrder_model_1.default.find({ patientId: patient._id, status: "pending", toHmo: "yes", hmoState: "hmo" });
        if (orders.length < 1) {
            return res
                .status(401)
                .json({ message: "no patient order at Hmo" });
        }
        return res.status(200).json({
            orders
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetPatientOrderSentToHmo = adminGetPatientOrderSentToHmo;
