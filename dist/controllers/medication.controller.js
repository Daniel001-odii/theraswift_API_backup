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
exports.getAllMedicationsController = exports.editMedicationController = exports.addMedicationController = exports.deleteMedicationFrontend = exports.deleteMedication = exports.getAllMedicationFrontendController = exports.adEssentialsMedicationFrontendController = exports.addMedicationFrontendController = void 0;
const Medications_model_1 = __importDefault(require("../models/Medications.model"));
const medication_middlware_1 = require("../middleware/medication.middlware");
const uuid_1 = require("uuid");
const awsS3_1 = require("../utils/awsS3");
const addMedicationFrontendController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("uploadMedication", { error: null });
});
exports.addMedicationFrontendController = addMedicationFrontendController;
const adEssentialsMedicationFrontendController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("essentialsUploadMedication", { error: null });
});
exports.adEssentialsMedicationFrontendController = adEssentialsMedicationFrontendController;
const getAllMedicationFrontendController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medications = yield Medications_model_1.default.find();
        res.render("viewMedications", { error: null, medications });
    }
    catch (err) {
        console.log(err);
        // throw err;
        res.status(500).json({ error: err.message });
    }
});
exports.getAllMedicationFrontendController = getAllMedicationFrontendController;
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
// DELETE endpoint for deleting a medication through an external API
const deleteMedicationFrontend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medication = yield Medications_model_1.default.findByIdAndDelete(req.params.id);
        if (!medication) {
            return res.status(404).json({ error: "Medication not found" });
        }
        res.redirect("/get_medications?success=Deleted+Successfully");
    }
    catch (error) {
        res.redirect("/get_medications?error=" + encodeURIComponent(error.message));
    }
});
exports.deleteMedicationFrontend = deleteMedicationFrontend;
// export const addMedicationController = async (
//   req: CustomFileAppendedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     // Validate the request body using express-validator
//     await Promise.all(
//       validateMedication.map((validation) => validation.run(req))
//     );
//     const {
//       name,
//       description,
//       strength,
//       warnings,
//       manufacturer,
//       price,
//       available,
//       expiryDate,
//       sideEffects,
//       ingredients,
//       storageInstructions,
//       contraindications,
//       routeOfAdministration,
//       prescription_required,
//       category,
//     } = req.body;
//     let image_url = "";
//     if (req.file) {
//       const filename = uuidv4();
//       const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
//       image_url = result.Location;
//       console.log(result);
//     }
//     // Save medication to MongoDB
//     const newMedication = new MedicationModel({
//       name,
//       description,
//       strength,
//       warnings,
//       manufacturer,
//       price,
//       available,
//       expiryDate,
//       sideEffects,
//       ingredients,
//       storageInstructions,
//       contraindications,
//       routeOfAdministration,
//       prescription_required,
//       image_url,
//       category,
//     }) as IMedication;
//     let medicationSaved = await newMedication.save();
//     console.log(medicationSaved);
//     res.send({
//       message: "Medication saved successfully",
//       medication: medicationSaved,
//     });
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };
const addMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body using express-validator
        yield Promise.all(medication_middlware_1.validateMedication.map((validation) => validation.run(req)));
        const { name, description, strength, warnings, manufacturer, price, available, expiryDate, sideEffects, ingredients, storageInstructions, contraindications, routeOfAdministration, prescription_required, category, medicationTypes, medicationForms, } = req.body;
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
        // Save medication to MongoDB
        const newMedication = new Medications_model_1.default({
            name,
            description,
            strength,
            warnings,
            manufacturer,
            price,
            available,
            expiryDate,
            sideEffects: sideEffectsArray,
            ingredients: ingredientsArray,
            storageInstructions,
            contraindications,
            routeOfAdministration,
            prescription_required,
            image_url,
            category,
            medicationTypes: medicationTypesArray,
            medicationForms: medicationFormsArray,
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
        // throw err;
        res.status(500).json({ error: err.message });
    }
});
exports.addMedicationController = addMedicationController;
// edit medication controller
const editMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        const updatedFields = req.body;
        if (updatedFields.id) {
            id = updatedFields.id;
            delete updatedFields.id;
        }
        let existingMedication = yield Medications_model_1.default.findOne({
            _id: id,
        });
        // Check if medication exists
        if (!existingMedication) {
            return res.status(404).json({ message: "Medication not found." });
        }
        const updatedMedication = yield Medications_model_1.default.findByIdAndUpdate(id, updatedFields, { new: true });
        console.log(updatedMedication);
        res.send({
            message: "Medication updated successfully",
            medication: updatedMedication,
        });
    }
    catch (err) {
        console.log(err);
        // throw err;
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
        // throw err;
        res.status(500).json({ error: err.message });
    }
});
exports.getAllMedicationsController = getAllMedicationsController;
