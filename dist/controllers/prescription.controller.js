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
exports.deleteUserPrescriptionById = exports.getUserPrescription = exports.getPrescriptions = exports.getPrescriptionById = exports.addPrescription = void 0;
const Prescription_model_1 = __importDefault(require("../models/Prescription.model"));
const awsS3_1 = require("../utils/awsS3");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let secret = process.env.JWT_SECRET_KEY;
        // Get JWT from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const { userId } = jsonwebtoken_1.default.verify(token, secret);
        let prescription_image_url = "";
        if (req.file) {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, awsS3_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            prescription_image_url = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
        }
        const prescription = new Prescription_model_1.default({
            userId,
            prescriptionImageUrl: prescription_image_url,
        });
        yield prescription.save();
        res
            .status(201)
            .json({ message: "Prescription added successfully", prescription });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding prescription", error });
    }
});
exports.addPrescription = addPrescription;
const getPrescriptionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { prescription_id } = req.params;
    try {
        let data = yield Prescription_model_1.default.findById(prescription_id);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPrescriptionById = getPrescriptionById;
const getPrescriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield Prescription_model_1.default.find();
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPrescriptions = getPrescriptions;
const getUserPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.body;
    try {
        let data = yield Prescription_model_1.default.find({ userId });
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUserPrescription = getUserPrescription;
const deleteUserPrescriptionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { prescription_id } = req.params;
    try {
        let data = yield Prescription_model_1.default.findByIdAndDelete(prescription_id);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUserPrescriptionById = deleteUserPrescriptionById;
