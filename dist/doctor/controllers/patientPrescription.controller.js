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
exports.doctorDeletePatientPrescriptioController = exports.addMedicationToPrescription = exports.addMedicationToPrescriptionOld = exports.patientPrescriptionDetailController = exports.patientPrescriptionController = void 0;
const express_validator_1 = require("express-validator");
const patientPrescription_model_1 = __importDefault(require("../modal/patientPrescription.model"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const medication_model_1 = __importDefault(require("../../admin/models/medication.model"));
const sendSms_utility_1 = require("../../utils/sendSms.utility");
// doctor prescribe medication for patient
const patientPrescriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor; // Assuming `req.doctor` is populated via middleware
        const { medications, patientId } = req.body;
        // Validate request body
        /* const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
     */
        // Check if patient exists
        const patientExists = yield patient_reg_model_1.default.findById(patientId);
        if (!patientExists) {
            return res.status(404).json({ message: "Patient does not exist" });
        }
        // Calculate the total cost of medications and validate their existence
        let totalAmount = 0;
        const validatedMedications = [];
        for (const med of medications) {
            const { dosage, frequency, route, duration, medicationId } = med;
            const medication = yield medication_model_1.default.findById(medicationId);
            if (!medication) {
                return res.status(404).json({
                    message: `Medication with ID ${medicationId} does not exist`,
                });
            }
            totalAmount += medication.price;
            validatedMedications.push({
                dosage,
                frequency,
                route,
                duration,
            });
        }
        // Create and save the patient prescription
        const newPrescription = new patientPrescription_model_1.default({
            status: "pending",
            doctorId: doctor._id,
            patientId,
            medications: validatedMedications,
            clinicCode: doctor.clinicCode,
        });
        const savedPrescription = yield newPrescription.save();
        // Send SMS to the patient
        const smsPayload = {
            to: `+${patientExists.phoneNumber}`,
            sms: `Hi ${patientExists.firstName}, you have a new prescription. Total cost: ${totalAmount}. Check your prescriptions at: theraswift.co/prescriptions/${savedPrescription._id}/checkout`,
        };
        yield (0, sendSms_utility_1.sendSms)(smsPayload);
        // Respond with the prescription details
        return res.status(201).json({
            message: "Prescription successfully added",
            patient: {
                id: patientExists._id,
                name: `${patientExists.firstName} ${patientExists.surname}`,
                phone: patientExists.phoneNumber,
            },
            prescription: {
                id: savedPrescription._id,
                status: savedPrescription.status,
                medications: savedPrescription.medications,
                totalAmount,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.patientPrescriptionController = patientPrescriptionController;
// ___ ___ \\
const patientPrescriptionDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try { }
    catch (error) { }
});
exports.patientPrescriptionDetailController = patientPrescriptionDetailController;
// add medication to patient prescription..
const addMedicationToPrescriptionOld = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prescription_id = req.params.prescription_id;
        const { medication_id } = req.body;
        if (!prescription_id) {
            return res.status(400).json({ message: "missing prescription_id on url params" });
        }
        const prescription = yield patientPrescription_model_1.default.findById(prescription_id);
        if (!prescription) {
            return res.status(400).json({ message: "prescription does not exist!" });
        }
        ;
        prescription.medications.push(medication_id);
        yield prescription.save();
        const total_meds = prescription.medications;
        // Fetch all medication prices concurrently
        const medication_prices = (yield Promise.all(total_meds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            const meds = yield medication_model_1.default.findById(id);
            return meds === null || meds === void 0 ? void 0 : meds.price;
        })))).filter((price) => price !== undefined); // Remove undefined values
        // Calculate the total price
        const total_price = medication_prices.reduce((a, b) => a + b, 0);
        res.status(201).json({ message: "new medication added to prescription successfuly!", total_price: total_price });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.addMedicationToPrescriptionOld = addMedicationToPrescriptionOld;
const addMedicationToPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prescription_id = req.params.prescription_id;
        const { medication } = req.body; // Expecting a single medication object
        if (!prescription_id) {
            return res
                .status(400)
                .json({ message: "Missing prescription_id in URL params" });
        }
        // Check if prescription exists
        const prescription = yield patientPrescription_model_1.default.findById(prescription_id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription does not exist!" });
        }
        // Validate medication (ensure required fields are present)
        const { medicationId, dosage, frequency, route, duration } = medication;
        if (!medicationId || !dosage || !frequency || !route || !duration) {
            return res
                .status(400)
                .json({ message: "Incomplete medication details in request body" });
        }
        // Verify the medication exists
        const medicationRecord = yield medication_model_1.default.findById(medicationId);
        if (!medicationRecord) {
            return res
                .status(404)
                .json({ message: `Medication with ID ${medicationId} does not exist` });
        }
        // Add new medication details to the prescription
        prescription.medications.push({ dosage, frequency, route, duration });
        yield prescription.save();
        // Calculate the total cost of all medications in the prescription
        const total_price = prescription.medications.reduce((total, med) => {
            // Find price for each medication using its ID
            if (med) {
                const price = (medicationRecord === null || medicationRecord === void 0 ? void 0 : medicationRecord.price) || 0;
                return total + price;
            }
            return total;
        }, 0);
        res.status(201).json({
            message: "New medication added to prescription successfully!",
            total_price,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
exports.addMedicationToPrescription = addMedicationToPrescription;
// doctor delete patient medication 
const doctorDeletePatientPrescriptioController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const { prescriptionId, patientId, } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId }).select("-password");
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        const deletePrescription = yield patientPrescription_model_1.default.findOneAndDelete({ _id: prescriptionId, patientId }, { new: true });
        if (!deletePrescription) {
            return res
                .status(401)
                .json({ message: "invalid prescription ID" });
        }
        return res.status(200).json({
            message: `prescription deleted successfully`,
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorDeletePatientPrescriptioController = doctorDeletePatientPrescriptioController;
