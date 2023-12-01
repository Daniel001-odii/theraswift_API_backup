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
exports.doctorRemovepatientPrescriptionController = exports.patientPrescriptionDetailNOTDeliveredController = exports.patientPrescriptionDeliveredDetailController = exports.patientPrescriptionDetailController = exports.patientPrescriptionController = void 0;
const express_validator_1 = require("express-validator");
const patientPrescription_model_1 = __importDefault(require("../modal/patientPrescription.model"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const medication_model_1 = __importDefault(require("../../admin/models/medication.model"));
// doctor prescribe medication for patient
const patientPrescriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { patientId, dosage, frequency, route, duration, medicationId } = req.body;
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
        //check if the medication is available
        const medication = yield medication_model_1.default.findOne({ _id: medicationId });
        if (!medication) {
            return res
                .status(401)
                .json({ message: "medication dose not exist" });
        }
        // Save patient prescription  to MongoDB
        const patientPrescription = new patientPrescription_model_1.default({
            dosage,
            frequency,
            route,
            duration,
            status: "pending",
            doctorId: doctor._id,
            clinicCode: doctor.clinicCode,
            medicationId: medicationId,
            patientId
        });
        const patientPrescriptionSaved = yield patientPrescription.save();
        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient: {
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            },
            prescription: {
                dosage: patientPrescriptionSaved.dosage,
                frequency: patientPrescriptionSaved.frequency,
                route: patientPrescriptionSaved.route,
                duration: patientPrescriptionSaved.duration,
                status: patientPrescriptionSaved.status,
                medicationId: patientPrescriptionSaved.medicationId
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.patientPrescriptionController = patientPrescriptionController;
//patient medication detail
const patientPrescriptionDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const patientPrescriptionDetail = yield patientPrescription_model_1.default.find({ patientId: patientId }).populate('medicationId', 'name price strength quantity medicationImage prescriptionRequired form ingredient medInfo').sort({ createdAt: -1 });
        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient: {
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            },
            prescription: {
                patientPrescriptionDetail
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.patientPrescriptionDetailController = patientPrescriptionDetailController;
// doctor get patient prescription that was delivered
const patientPrescriptionDeliveredDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const patientPrescriptionDetail = yield patientPrescription_model_1.default.find({ patientId: patientId, status: "delivered" }).populate('medicationId', 'name price strength quantity medicationImage prescriptionRequired form ingredient medInfo').sort({ createdAt: -1 });
        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient: {
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            },
            prescription: {
                patientPrescriptionDetail
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.patientPrescriptionDeliveredDetailController = patientPrescriptionDeliveredDetailController;
// get patient prescription detail that was not delivered
const patientPrescriptionDetailNOTDeliveredController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const patientPrescriptionDetail = yield patientPrescription_model_1.default.find({ patientId: patientId, status: "pending" }).populate('medicationId', 'name price strength quantity medicationImage prescriptionRequired form ingredient medInfo').sort({ createdAt: -1 });
        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient: {
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            },
            prescription: {
                patientPrescriptionDetail
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.patientPrescriptionDetailNOTDeliveredController = patientPrescriptionDetailNOTDeliveredController;
// doctor remove patient medication
const doctorRemovepatientPrescriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { prescriptionId, } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const removePrescription = yield patientPrescription_model_1.default.findOneAndDelete({ _id: prescriptionId }, { new: true });
        if (!removePrescription) {
            return res.status(401)
                .json({ message: "prescription not available" });
        }
        return res.status(200).json({
            message: "prescription deleted successfuuy",
            deletedMedication: removePrescription
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorRemovepatientPrescriptionController = doctorRemovepatientPrescriptionController;
