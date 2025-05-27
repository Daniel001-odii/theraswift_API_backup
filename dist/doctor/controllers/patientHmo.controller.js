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
exports.doctorGetPatientHmoDeniedController = exports.doctorGetPatientHmoApproveController = exports.doctorGetPatientHmoPendingController = exports.doctorSentPatientToHmoController = void 0;
const express_validator_1 = require("express-validator");
const patientHmo_model_1 = __importDefault(require("../modal/patientHmo.model"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
const doctor_reg_modal_1 = __importDefault(require("..//modal/doctor_reg.modal"));
// doctor sent patient to hmo
const doctorSentPatientToHmoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        const { patientId, EnroleNumber, icdCode, hmoClinicCode } = req.body;
        const file = req.file;
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
        // check if patient exist
        const patientExists = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patientExists) {
            return res
                .status(401)
                .json({ message: "patient does not exist" });
        }
        let medicalRecord;
        if (!file) {
            return res
                .status(401)
                .json({ message: "provide medical record" });
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            medicalRecord = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
            //medicationImg = uploadToS3(file);
        }
        const newPatientHmo = new patientHmo_model_1.default({
            firstName: patientExists.firstName,
            surname: patientExists.surname,
            phoneNumber: patientExists.phoneNumber,
            EnroleNumber: EnroleNumber,
            email: patientExists.email,
            address: patientExists.address,
            medicalRecord: medicalRecord,
            status: 'pending',
            patientId: patientId,
            doctorClinicCode: doctorExist.clinicCode,
            icdCode: icdCode,
            hmoClinicCode: hmoClinicCode,
        });
        yield newPatientHmo.save();
        return res.status(200).json({
            message: "patient data successfully sent to Hmo",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSentPatientToHmoController = doctorSentPatientToHmoController;
// doctor get patient hmo that is pending
const doctorGetPatientHmoPendingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        let { page, limit } = req.query;
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
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; //
        const pendingPatientHmo = yield patientHmo_model_1.default.find({ doctorClinicCode: doctorExist.clinicCode, status: "pending" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            pendingPatientHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGetPatientHmoPendingController = doctorGetPatientHmoPendingController;
// doctor get patient hmo that is approve
const doctorGetPatientHmoApproveController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        let { page, limit } = req.query;
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
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; //
        const approvePatientHmo = yield patientHmo_model_1.default.find({ doctorClinicCode: doctorExist.clinicCode, status: "approved" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            approvePatientHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGetPatientHmoApproveController = doctorGetPatientHmoApproveController;
// doctor get patient hmo that is denied
const doctorGetPatientHmoDeniedController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        let { page, limit } = req.query;
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
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; //
        const deniedPatientHmo = yield patientHmo_model_1.default.find({ doctorClinicCode: doctorExist.clinicCode, status: "denied" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            deniedPatientHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGetPatientHmoDeniedController = doctorGetPatientHmoDeniedController;
