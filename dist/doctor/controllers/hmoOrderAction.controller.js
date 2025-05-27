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
exports.hmoGetPatientOrdeHeTakeActionController = exports.hmoTakeActionOnOrderSentToHimController = exports.hmoGetPatientOrderSentToHimController = void 0;
const express_validator_1 = require("express-validator");
const patientPrescription_model_1 = __importDefault(require("../modal/patientPrescription.model"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const doctor_reg_modal_1 = __importDefault(require("..//modal/doctor_reg.modal"));
const patientOrder_model_1 = __importDefault(require("../modal/patientOrder.model"));
// hmo get patient medication order send to him
const hmoGetPatientOrderSentToHimController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        const { patientId, } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctorExist = yield doctor_reg_modal_1.default.findOne({ _id: doctorId });
        if (!doctorExist) {
            return res
                .status(401)
                .json({ message: "incorrect doctor ID" });
        }
        if (doctorExist.organization != 'HMO') {
            return res
                .status(401)
                .json({ message: "hmo role" });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        const ordersAtHmos = yield patientOrder_model_1.default.find({ patientId, status: "pending", toHmo: "yes", hmoState: "hmo" });
        let orderMedication = [];
        /* for (let i = 0; i < ordersAtHmos.length; i++) {
            const ordersAtHmo = ordersAtHmos[i];

            const patientPriscription = await PatientPrescriptionModel.findOne({_id: ordersAtHmo.patientPrescriptionId})

            if (!patientPriscription) continue;

            const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})

            if (!medication) continue;

            const obj = {
                order: ordersAtHmo,
                patientPriscription,
                medication,
            }

            orderMedication.push(obj)
        }
     
        return res.status(200).json({
            orderMedication
        }) */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.hmoGetPatientOrderSentToHimController = hmoGetPatientOrderSentToHimController;
// hmo take action on each order sent to him either to pay full or halve or not
const hmoTakeActionOnOrderSentToHimController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        const { patientId, orderId, amount } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctorExist = yield doctor_reg_modal_1.default.findOne({ _id: doctorId });
        if (!doctorExist) {
            return res
                .status(401)
                .json({ message: "incorrect doctor ID" });
        }
        if (doctorExist.organization != 'HMO') {
            return res
                .status(401)
                .json({ message: "hmo role" });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        const order = yield patientOrder_model_1.default.findOne({ _id: orderId, patientId, status: "pending", toHmo: "yes", hmoState: "hmo" });
        if (!order) {
            return res
                .status(401)
                .json({ message: "incorrect Order ID" });
        }
        const patientPriscription = yield patientPrescription_model_1.default.findOne({ _id: order.patientPrescriptionId });
        if (!patientPriscription) {
            return res
                .status(401)
                .json({ message: "no preiscription for this order" });
        }
        /*
                const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})
                if (!medication){
                    return res
                    .status(401)
                    .json({ message: "medication do not exits" });
                }
        
                if (amount > medication.price) {
                    return res
                    .status(401)
                    .json({ message: "the amount you enter is above the price" });
                }
        
                if (amount < 1) {
                    return res
                    .status(401)
                    .json({ message: "enter reasonable amount" });
                }
        
                order.hmoPayment = amount;
                order.hmoState = "final";
                await order.save()
         */
        return res.status(200).json({
            message: "order successfully mark"
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.hmoTakeActionOnOrderSentToHimController = hmoTakeActionOnOrderSentToHimController;
// hmo get patient medication order he has taken action on
const hmoGetPatientOrdeHeTakeActionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        const { patientId, } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctorExist = yield doctor_reg_modal_1.default.findOne({ _id: doctorId });
        if (!doctorExist) {
            return res
                .status(401)
                .json({ message: "incorrect doctor ID" });
        }
        if (doctorExist.organization != 'HMO') {
            return res
                .status(401)
                .json({ message: "hmo role" });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        const ordersAtFinals = yield patientOrder_model_1.default.find({ patientId, status: "pending", toHmo: "yes", hmoState: "final" });
        let orderMedication = [];
        /* for (let i = 0; i < ordersAtFinals.length; i++) {
            const ordersAtFinal = ordersAtFinals[i];

            const patientPriscription = await PatientPrescriptionModel.findOne({_id: ordersAtFinal.patientPrescriptionId})

            if (!patientPriscription) continue;

            const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})

            if (!medication) continue;

            const obj = {
                order: ordersAtFinal,
                patientPriscription,
                medication,
            }

            orderMedication.push(obj)
        }
     
        return res.status(200).json({
            orderMedication
        }) */
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.hmoGetPatientOrdeHeTakeActionController = hmoGetPatientOrdeHeTakeActionController;
