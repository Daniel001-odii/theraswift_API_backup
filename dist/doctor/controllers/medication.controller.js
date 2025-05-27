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
exports.doctorGetPopualarMedicationController = exports.doctorGethMedicationByIdController = exports.doctorGethMedicationController = exports.doctorSearchMedicationNameFormDosageController = exports.doctorSearchMedicationNameFormController = exports.doctorSearchMedicationNameController = void 0;
const express_validator_1 = require("express-validator");
const medication_model_1 = __importDefault(require("../../admin/models/medication.model"));
//doctor searching for  medication by name /////////////
const doctorSearchMedicationNameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medications = yield medication_model_1.default.find({ name: { $regex: name, $options: 'i' } });
        return res.status(200).json({
            medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSearchMedicationNameController = doctorSearchMedicationNameController;
//doctor searching for  medication by name and form /////////////
const doctorSearchMedicationNameFormController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, form } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medications = yield medication_model_1.default.find({ name, form });
        return res.status(200).json({
            medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSearchMedicationNameFormController = doctorSearchMedicationNameFormController;
//doctor searching for  medication by name, form and dosage /////////////
const doctorSearchMedicationNameFormDosageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, form, dosage } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medications = yield medication_model_1.default.find({ name, form, quantity: dosage });
        return res.status(200).json({
            medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSearchMedicationNameFormDosageController = doctorSearchMedicationNameFormDosageController;
//doctor get medication   /////////////
const doctorGethMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalmedication = yield medication_model_1.default.countDocuments(); // Get the total number of documents
        const medications = yield medication_model_1.default.find().skip(skip).limit(limit);
        return res.status(200).json({
            medications,
            totalmedication,
            currentPage: page,
            totalPages: Math.ceil(totalmedication / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGethMedicationController = doctorGethMedicationController;
//doctor medication by Id  /////////////
const doctorGethMedicationByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meidcationId } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medication = yield medication_model_1.default.findOne({ _id: meidcationId });
        if (!medication) {
            return res
                .status(401)
                .json({ message: "invalid medication Id" });
        }
        return res.status(200).json({
            medication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGethMedicationByIdController = doctorGethMedicationByIdController;
//get popular medication /////////////
const doctorGetPopualarMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const popularMedication = yield medication_model_1.default.find().limit(8);
        return res.status(200).json({
            popularMedication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGetPopualarMedicationController = doctorGetPopualarMedicationController;
