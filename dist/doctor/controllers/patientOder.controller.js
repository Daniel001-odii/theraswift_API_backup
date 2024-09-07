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
exports.doctorgetPatientOderdelieverd = exports.doctorgetPatientOderPaid = exports.doctorgetPatientOderPending = exports.doctorSendPatientOderHmoController = exports.doctorSendPatientOderOutOFPocketController = void 0;
const express_validator_1 = require("express-validator");
const patientPrescription_model_1 = __importDefault(require("../modal/patientPrescription.model"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const medication_model_1 = __importDefault(require("../../admin/models/medication.model"));
const doctor_reg_modal_1 = __importDefault(require("..//modal/doctor_reg.modal"));
const orderFromDoctor_model_1 = __importDefault(require("../../admin/models/orderFromDoctor.model"));
const patientHmo_model_1 = __importDefault(require("../modal/patientHmo.model"));

// doctor sending patint medication order for out of pocket
const doctorSendPatientOderOutOFPocketController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { patientId, } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        const precriptions = yield patientPrescription_model_1.default.find({ patientId, clinicCode: doctor.clinicCode });
        if (precriptions.length < 1) {
            return res
                .status(401)
                .json({ message: "no priscription for this patient" });
        }
        let totalCost = 0;
        let medArray = [];
        for (let i = 0; i < precriptions.length; i++) {
            const precription = precriptions[i];
            const medication = yield medication_model_1.default.findOne({ _id: precription.medicationId });
            if (!medication) {
                continue;
            }
            totalCost = totalCost + parseInt(medication.price);
            const medicationObt = {
                medication,
                orderQuantity: 1,
                dosage: precription.dosage,
                frequency: precription.frequency,
                route: precription.route,
                duration: precription.duration,
            };
            medArray.push(medicationObt);
        }
        const order = new orderFromDoctor_model_1.default({
            patientId,
            doctortId: doctor._id,
            clinicCode: doctor.clinicCode,
            paymentId: '',
            medications: medArray,
            deliveryDate: "",
            totalAmount: totalCost.toString(),
            amountPaid: "0",
            paymentDate: '',
            methodOfPayment: "pocket",
            hmoName: "",
            status: "pending"
        });
        const saveOder = yield order.save();
        return res.status(200).json({
            message: "order successfully sent to pharmacy",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSendPatientOderOutOFPocketController = doctorSendPatientOderOutOFPocketController;

// doctor sending patint medication order for HMO
const doctorSendPatientOderHmoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { patientId, firstName, surname, phoneNumber, EnroleNumber, email, address, medicalCode, medicalRecord, hmoID, } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        //check for hmo
        const hmo = yield doctor_reg_modal_1.default.findOne({ _id: hmoID, organization: "HMO" });
        if (!hmo) {
            return res
                .status(401)
                .json({ message: "hmo not found" });
        }
        const precriptions = yield patientPrescription_model_1.default.find({ patientId, clinicCode: doctor.clinicCode });
        if (precriptions.length < 1) {
            return res
                .status(401)
                .json({ message: "no priscription for this patient" });
        }
        let totalCost = 0;
        let medArray = [];
        for (let i = 0; i < precriptions.length; i++) {
            const precription = precriptions[i];
            const medication = yield medication_model_1.default.findOne({ _id: precription.medicationId });
            if (!medication) {
                continue;
            }
            totalCost = totalCost + parseInt(medication.price);
            const medicationObt = {
                medication,
                orderQuantity: 1,
                dosage: precription.dosage,
                frequency: precription.frequency,
                route: precription.route,
                duration: precription.duration,
            };
            medArray.push(medicationObt);
        }
        const order = new orderFromDoctor_model_1.default({
            patientId,
            doctortId: doctor._id,
            clinicCode: doctor.clinicCode,
            paymentId: '',
            medications: medArray,
            deliveryDate: "",
            totalAmount: totalCost.toString(),
            amountPaid: "0",
            paymentDate: '',
            methodOfPayment: "HMO",
            hmoName: `${hmo.firstName} ${hmo.lastName}`,
            status: "pending"
        });
        const saveOder = yield order.save();
        const patientHMO = new patientHmo_model_1.default({
            firstName,
            surname,
            phoneNumber,
            EnroleNumber,
            email,
            address,
            medicalCode,
            medicalRecord,
            status: "pending",
            doctorId: doctor._id,
            patientId: patientId,
            hmoID: hmoID,
            clinicCode: doctor.clinicCode,
            orderId: saveOder._id,
        });
        const savePatientHmo = yield patientHMO.save();
        return res.status(200).json({
            message: "order successfully sent to pharmacy",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSendPatientOderHmoController = doctorSendPatientOderHmoController;

// doctor doctor get patient pending order
const doctorgetPatientOderPending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const {} = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pendingOder = yield orderFromDoctor_model_1.default.find({ clinicCode: doctor.clinicCode, status: "pending" }).populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address').sort({ createdAt: -1 });
        return res.status(200).json({
            pendingOder
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorgetPatientOderPending = doctorgetPatientOderPending;


// doctor get patient paid order
const doctorgetPatientOderPaid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const {} = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const paidgOder = yield orderFromDoctor_model_1.default.find({ clinicCode: doctor.clinicCode, status: "paid" }).populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address').sort({ createdAt: -1 });
        return res.status(200).json({
            paidgOder
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorgetPatientOderPaid = doctorgetPatientOderPaid;


// doctor get patient delieverd order
const doctorgetPatientOderdelieverd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const {} = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const delieverdegOder = yield orderFromDoctor_model_1.default.find({ clinicCode: doctor.clinicCode, status: "delivered" }).populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address').sort({ createdAt: -1 });
        return res.status(200).json({
            delieverdegOder
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorgetPatientOderdelieverd = doctorgetPatientOderdelieverd;
