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
exports.hmoGetPatientHeDeniedController = exports.hmoGetPatientHeApproveController = exports.hmoApproveOrDeniedPatientController = exports.hmoGetPatientSentToHimController = void 0;
const express_validator_1 = require("express-validator");
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const patientHmo_model_1 = __importDefault(require("../modal/patientHmo.model"));
// hmo get patient sent to him
const hmoGetPatientSentToHimController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (doctorExist.organization != 'HMO') {
            return res
                .status(401)
                .json({ message: "hmo role" });
        }
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; //
        const patientHmo = yield patientHmo_model_1.default.find({ hmoClinicCode: doctorExist.clinicCode, status: "pending" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            patientHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.hmoGetPatientSentToHimController = hmoGetPatientSentToHimController;
// hmo get patient aprove or denied to him
const hmoApproveOrDeniedPatientController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;
        let { hmoID, status } = req.body;
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
        if (doctorExist.organization != 'HMO') {
            return res
                .status(401)
                .json({ message: "hmo role" });
        }
        const patientHmo = yield patientHmo_model_1.default.findOne({ _id: hmoID, hmoClinicCode: doctorExist.clinicCode, status: "pending" });
        if (!patientHmo) {
            return res
                .status(401)
                .json({ message: "incorrect hmo ID" });
        }
        patientHmo.status = status;
        yield patientHmo.save();
        return res.status(200).json({
            message: "action successfully taken"
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.hmoApproveOrDeniedPatientController = hmoApproveOrDeniedPatientController;
// hmo get patient he approve
const hmoGetPatientHeApproveController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (doctorExist.organization != 'HMO') {
            return res
                .status(401)
                .json({ message: "hmo role" });
        }
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; //
        const patientHmo = yield patientHmo_model_1.default.find({ hmoClinicCode: doctorExist.clinicCode, status: "approved" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            patientHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.hmoGetPatientHeApproveController = hmoGetPatientHeApproveController;
// hmo get patient he denied
const hmoGetPatientHeDeniedController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (doctorExist.organization != 'HMO') {
            return res
                .status(401)
                .json({ message: "hmo role" });
        }
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; //
        const patientHmo = yield patientHmo_model_1.default.find({ hmoClinicCode: doctorExist.clinicCode, status: "denied" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            patientHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.hmoGetPatientHeDeniedController = hmoGetPatientHeDeniedController;
