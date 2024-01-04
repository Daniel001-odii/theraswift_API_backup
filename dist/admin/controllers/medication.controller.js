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
exports.getTotalMedicationController = exports.getPageMedicationController = exports.getSpecificNumbereMedicationController = exports.getsingleMedicationController = exports.getAllMedicationController = exports.adminDeleteMedicationController = exports.adminEditMedicationController = exports.adminAddMedicationController = void 0;
const express_validator_1 = require("express-validator");
const medication_model_1 = __importDefault(require("../models/medication.model"));
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
//admin add medications /////////////
const adminAddMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Access the uploaded file details
        const file = req.file;
        // const fileName = file?.filename;
        // const filePath = file?.path;
        let medicationImg;
        const { name, price, quantity, prescriptionRequired, form, ingredient, quantityForUser, inventoryQuantity, expiredDate, category, medInfo } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("meidinfo", medInfo);
        const jsonMedInfo = JSON.parse(medInfo);
        console.log("json", jsonMedInfo);
        if (!file) {
            medicationImg = '';
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            medicationImg = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
            //medicationImg = uploadToS3(file);
        }
        const medication = new medication_model_1.default({
            name,
            price,
            quantity,
            prescriptionRequired,
            form,
            ingredient,
            quantityForUser,
            inventoryQuantity,
            expiredDate,
            category,
            medInfo: jsonMedInfo,
            medicationImage: medicationImg,
        });
        const savedMedication = yield medication.save();
        // const domainName = req.hostname;
        // medicationImg = `${domainName}/public/uploads/${fileName}`;
        return res.status(200).json({
            message: "medication added successfuuy",
            medication: savedMedication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminAddMedicationController = adminAddMedicationController;
//admin edit medications /////////////
const adminEditMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let medicationImg;
        const { medicationId, name, price, quantity, prescriptionRequired, form, ingredient, quantityForUser, inventoryQuantity, expiredDate, category, medInfo, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updatedMedication = yield medication_model_1.default.findOneAndUpdate({ _id: medicationId }, {
            name,
            price,
            quantity,
            prescriptionRequired,
            form,
            ingredient,
            quantityForUser,
            inventoryQuantity,
            expiredDate,
            category,
            medInfo
        }, { new: true });
        if (!updatedMedication) {
            return res.status(401)
                .json({ message: "medication not available" });
        }
        // const domainName = req.hostname;
        // medicationImg = `${domainName}/public/uploads/${updatedMedication.medicationImage}`;
        return res.status(200).json({
            message: "medication updated successfuuy",
            medication: updatedMedication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminEditMedicationController = adminEditMedicationController;
//admin delete medications /////////////
const adminDeleteMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let medicationImg;
        const { medicationId, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const deletedMedication = yield medication_model_1.default.findOneAndDelete({ _id: medicationId }, { new: true });
        if (!deletedMedication) {
            return res.status(401)
                .json({ message: "medication not available" });
        }
        // const domainName = req.hostname;
        // medicationImg = `${domainName}/public/uploads/${deletedMedication.medicationImage}`;
        return res.status(200).json({
            message: "medication deleted successfuuy",
            deletedMedication: deletedMedication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminDeleteMedicationController = adminDeleteMedicationController;
//get all medications /////////////
const getAllMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Medications = yield medication_model_1.default.find();
        return res.status(200).json({
            message: "success",
            Medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getAllMedicationController = getAllMedicationController;
//get single medications /////////////
const getsingleMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medicationId, } = req.body;
        const Medication = yield medication_model_1.default.findOne({ _id: medicationId });
        return res.status(200).json({
            message: "success",
            Medication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getsingleMedicationController = getsingleMedicationController;
//get specific number of medication medications /////////////
const getSpecificNumbereMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { howMany } = req.body;
        const limit = howMany || 50; // You can set a default limit or accept it as a query parameter
        const Medications = yield medication_model_1.default.find().limit(Number(limit));
        return res.status(200).json({
            message: "success",
            Medications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getSpecificNumbereMedicationController = getSpecificNumbereMedicationController;
//get spage of medication medications /////////////
const getPageMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip
        const totalMedications = yield medication_model_1.default.countDocuments(); // Get the total number of documents
        const medications = yield medication_model_1.default.find()
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            message: "success",
            medications,
            currentPage: page,
            totalPages: Math.ceil(totalMedications / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getPageMedicationController = getPageMedicationController;
//get total medication medications /////////////
const getTotalMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        const totalMedications = yield medication_model_1.default.countDocuments(); // Get the total number of documents
        return res.status(200).json({
            message: "success",
            totalMedications
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getTotalMedicationController = getTotalMedicationController;
