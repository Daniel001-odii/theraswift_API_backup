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
exports.userAddMedicationThroughImageController = exports.userMedicatonRequiredPrescriptionController = exports.userPrescriptionStatusController = exports.userAddPrescriptionImageController = exports.userGetMedicationController = exports.userSearchMedicationNameFormDosageController = exports.userSearchMedicationNameFormController = exports.userSearchMedicationNameController = exports.userSearchMedicationController = exports.userRemoveMedicationController = exports.userAddMedicationController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const medication_model_1 = __importDefault(require("../models/medication.model"));
const medication_model_2 = __importDefault(require("../../admin/models/medication.model"));
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
const medicationByImage_model_1 = __importDefault(require("../models/medicationByImage.model"));
//user add medication /////////////
const userAddMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medicationId, } = req.body;
        const file = req.file;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        console.log(userId);
        // check if the medication is in database
        const medication = yield medication_model_2.default.findOne({ _id: medicationId });
        if (!medication) {
            return res
                .status(401)
                .json({ message: "invalid medication" });
        }
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const existUserMedication = yield medication_model_1.default.findOne({ userId, medicationId });
        if (existUserMedication) {
            return res
                .status(401)
                .json({ message: "medication already added" });
        }
        let prescriptionStatus = false;
        if (medication.prescriptionRequired) {
            prescriptionStatus = false;
        }
        else {
            prescriptionStatus = true;
        }
        //if medication those not exist
        const userMedication = new medication_model_1.default({
            userId: userId,
            medicationId: medicationId,
            prescriptionStatus: prescriptionStatus
        });
        const saveUserMedication = yield userMedication.save();
        return res.status(200).json({
            message: "medication added succefully",
            medication: medication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userAddMedicationController = userAddMedicationController;
//user remove  medication /////////////
const userRemoveMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMedicationId } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        console.log(userId);
        // check if the medication is in database
        const deletedmedication = yield medication_model_1.default.findOneAndDelete({ _id: userMedicationId }, { new: true });
        if (!deletedmedication) {
            return res
                .status(401)
                .json({ message: "invalid medication" });
        }
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const medication = yield medication_model_2.default.findOne({ _id: deletedmedication.medicationId });
        return res.status(200).json({
            message: "medication removed successfiily",
            removedMedication: deletedmedication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userRemoveMedicationController = userRemoveMedicationController;
//user searching for  medication /////////////
const userSearchMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medicationName } = req.query;
        // const medication = await MedicationModel.find({
        //   name: { $regex: medicationName, $options: 'i' }, // Case-insensitive search
        // });
        // return res.status(200).json({
        //   medication 
        // })
        const columnName = 'name';
        // const { columnName } = req.params;
        // const { query } = req.query;
        const searchQuery = {
            $or: [
                { name: { $regex: medicationName, $options: 'i' } }, // Perform a case-insensitive search
                // Add more fields as needed for your search
            ],
        };
        console.log(medicationName);
        console.log("era", searchQuery);
        const aggregationPipeline = [
            { $match: searchQuery },
            {
                $group: {
                    _id: `$${columnName}`,
                    count: { $sum: 1 }, // Optionally, you can count the documents in each group
                },
            },
            // You can add more stages to the aggregation pipeline if needed
        ];
        const result = yield medication_model_2.default.aggregate(aggregationPipeline);
        let output = [];
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const bd = yield medication_model_2.default.findOne({ name: element._id });
            const obj = {
                name: element._id,
                ingridient: bd === null || bd === void 0 ? void 0 : bd.ingredient,
            };
            output.push(obj);
        }
        return res.status(200).json({
            medications: output
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userSearchMedicationController = userSearchMedicationController;
//user searching for  medication by name /////////////
const userSearchMedicationNameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medications = yield medication_model_2.default.find({ name: { $regex: name, $options: 'i' } });
        return res.status(200).json({
            medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userSearchMedicationNameController = userSearchMedicationNameController;
//user searching for  medication by name and form /////////////
const userSearchMedicationNameFormController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, form } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medications = yield medication_model_2.default.find({ name, form });
        return res.status(200).json({
            medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userSearchMedicationNameFormController = userSearchMedicationNameFormController;
//user searching for  medication by name, form and dosage /////////////
const userSearchMedicationNameFormDosageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, form, dosage } = req.query;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medications = yield medication_model_2.default.find({ name, form, quantity: dosage });
        return res.status(200).json({
            medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userSearchMedicationNameFormDosageController = userSearchMedicationNameFormDosageController;
//get all medication for specific user /////////////
const userGetMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        const userMedications = yield medication_model_1.default.find({ userId });
        let medications = [];
        for (let i = 0; i < userMedications.length; i++) {
            const userMedication = userMedications[i];
            const medication = yield medication_model_2.default.findOne({ _id: userMedication.medicationId });
            const medObj = {
                medicationId: medication === null || medication === void 0 ? void 0 : medication._id,
                userMedicationId: userMedication._id,
                medication
            };
            medications.push(medObj);
        }
        return res.status(200).json({
            medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userGetMedicationController = userGetMedicationController;
//user add prescription image/////////////
const userAddPrescriptionImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userMedicationId, } = req.body;
        const file = req.file;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const existUserMedication = yield medication_model_1.default.findOne({ _id: userMedicationId, userId });
        if (!existUserMedication) {
            return res
                .status(401)
                .json({ message: "invalid medication ID" });
        }
        let prescriptionImg;
        if (!file) {
            return res
                .status(401)
                .json({ message: "provide image" });
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            prescriptionImg = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
            //medicationImg = uploadToS3(file);
        }
        existUserMedication.prescriptionImage = prescriptionImg;
        existUserMedication.prescriptionStatus = true;
        const updatedMedication = yield existUserMedication.save();
        return res.status(200).json({
            message: "prescription added succefully",
            medication: updatedMedication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userAddPrescriptionImageController = userAddPrescriptionImageController;
//check user prescriptions status/////////////
const userPrescriptionStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const userMedications = yield medication_model_1.default.find({ userId });
        if (userMedications.length < 1) {
            return res
                .status(401)
                .json({ message: "no medication for this user" });
        }
        let prescriptionId = [];
        for (let i = 0; i < userMedications.length; i++) {
            const userMedication = userMedications[i];
            const medication = yield medication_model_2.default.findOne({ _id: userMedication.medicationId });
            if ((medication === null || medication === void 0 ? void 0 : medication.prescriptionRequired) == "required" && userMedication.prescriptionStatus == false) {
                prescriptionId.push(userMedication._id);
            }
        }
        if (prescriptionId.length > 0) {
            return res
                .status(401)
                .json({
                checkoutStatus: false,
                message: "some meidcation need prescription"
            });
        }
        return res.status(200).json({
            checkoutStatus: true,
            message: "no issue with prescription",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userPrescriptionStatusController = userPrescriptionStatusController;
//get user medication that required prescription/////////////
const userMedicatonRequiredPrescriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const userMedications = yield medication_model_1.default.find({ userId });
        if (userMedications.length < 1) {
            return res
                .status(401)
                .json({ message: "no medication for this user" });
        }
        let prescriptionId = [];
        for (let i = 0; i < userMedications.length; i++) {
            const userMedication = userMedications[i];
            const medication = yield medication_model_2.default.findOne({ _id: userMedication.medicationId });
            if ((medication === null || medication === void 0 ? void 0 : medication.prescriptionRequired) == "required" && userMedication.prescriptionStatus == false) {
                const presObj = {
                    medicationId: medication._id,
                    userMedicationId: userMedication._id,
                    medication
                };
                prescriptionId.push(presObj);
            }
        }
        if (prescriptionId.length < 1) {
            return res
                .status(401)
                .json({
                message: "no meidcation need prescription"
            });
        }
        return res.status(200).json({
            medications: prescriptionId
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userMedicatonRequiredPrescriptionController = userMedicatonRequiredPrescriptionController;
//user add medication through image/////////////
const userAddMedicationThroughImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        const file = req.file;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        let prescriptionImg;
        if (!file) {
            return res
                .status(401)
                .json({ message: "provide image" });
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            prescriptionImg = result === null || result === void 0 ? void 0 : result.Location;
        }
        const patientMedImg = new medicationByImage_model_1.default({
            userId: userId,
            patientMedicationImage: prescriptionImg
        });
        const savePatientMedImg = yield patientMedImg.save();
        return res.status(200).json({
            message: "prescription added succefully",
            medication: savePatientMedImg
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userAddMedicationThroughImageController = userAddMedicationThroughImageController;
