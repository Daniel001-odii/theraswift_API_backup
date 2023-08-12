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
exports.getAllMedicationsController = exports.editMedicationController = exports.addMedicationController = exports.deleteMedication = void 0;
const Medications_model_1 = __importDefault(require("../models/Medications.model"));
const medication_middlware_1 = require("../middleware/medication.middlware");
const uuid_1 = require("uuid");
const awsS3_1 = require("../utils/awsS3");
// DELETE endpoint for deleting a medication
const deleteMedication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { medication_id } = req.body;
        const medication = yield Medications_model_1.default.findByIdAndDelete(medication_id);
        if (!medication) {
            return res.status(404).json({ error: "Medication not found" });
        }
        res.json({ message: "Medication deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteMedication = deleteMedication;
const addMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body using express-validator
        yield Promise.all(medication_middlware_1.validateMedication.map((validation) => validation.run(req)));
        const { name, description, strength, warnings, manufacturer, price, available, sideEffects, ingredients, storageInstructions, contraindications, routeOfAdministration, prescription_required_type, essential_category, medicationTypes, medicationForms, uses, quantity: medicationQuantities, } = req.body;
        let image_url = "";
        if (req.file) {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, awsS3_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            image_url = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
        }
        const sideEffectsArray = Array.isArray(sideEffects)
            ? sideEffects
            : sideEffects
                ? sideEffects.includes(",")
                    ? sideEffects.split(",").map((effect) => effect.trim())
                    : [sideEffects]
                : [];
        const ingredientsArray = Array.isArray(ingredients)
            ? ingredients
            : ingredients
                ? ingredients.includes(",")
                    ? ingredients.split(",").map((ingredient) => ingredient.trim())
                    : [ingredients]
                : [];
        const medicationTypesArray = Array.isArray(medicationTypes)
            ? medicationTypes
            : medicationTypes
                ? medicationTypes.includes(",")
                    ? medicationTypes
                        .split(",")
                        .map((medicationType) => medicationType.trim())
                    : [medicationTypes]
                : [];
        const medicationFormsArray = Array.isArray(medicationForms)
            ? medicationForms
            : medicationForms
                ? medicationForms.includes(",")
                    ? medicationForms
                        .split(",")
                        .map((medicationForm) => medicationForm.trim())
                    : [medicationForms]
                : [];
        const medicationQuantitiesArray = Array.isArray(medicationQuantities)
            ? medicationQuantities
            : medicationQuantities
                ? medicationQuantities.includes(",")
                    ? medicationQuantities
                        .split(",")
                        .map((medicationQuantity) => medicationQuantity.trim())
                    : [medicationQuantities]
                : [];
        // Save medication to MongoDB
        const newMedication = new Medications_model_1.default({
            name,
            description,
            strength,
            warnings,
            manufacturer,
            price,
            quantity: medicationQuantitiesArray,
            available,
            sideEffects: sideEffectsArray,
            ingredients: ingredientsArray,
            storageInstructions,
            contraindications,
            routeOfAdministration,
            prescription_required_type,
            image_url,
            essential_category,
            medicationTypes: medicationTypesArray,
            medicationForms: medicationFormsArray,
            uses,
        });
        let medicationSaved = yield newMedication.save();
        console.log(medicationSaved);
        res.send({
            message: "Medication saved successfully",
            medication: medicationSaved,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});
exports.addMedicationController = addMedicationController;
// edit medication controller
const editMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let { id } = req.params;
        const { updatedFields, medication_id } = req.body;
        if (updatedFields.id) {
            delete updatedFields.id;
        }
        let existingMedication = yield Medications_model_1.default.findOne({
            _id: medication_id,
        });
        // Check if medication exists
        if (!existingMedication) {
            return res.status(404).json({ message: "Medication not found." });
        }
        const updatedMedication = yield Medications_model_1.default.findByIdAndUpdate(medication_id, updatedFields, { new: true });
        res.send({
            message: "Medication updated successfully",
            medication: updatedMedication,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});
exports.editMedicationController = editMedicationController;
const getAllMedicationsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medications = yield Medications_model_1.default.find();
        res.send({
            message: "Successfully retrieved all medications",
            medications: medications,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});
exports.getAllMedicationsController = getAllMedicationsController;
