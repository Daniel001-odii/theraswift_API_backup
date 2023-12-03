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
exports.doctorgetPatientHmodenied = exports.doctorgetPatientHmoApproved = exports.doctorgetPatientHmoPending = void 0;
const express_validator_1 = require("express-validator");
const patientHmo_model_1 = __importDefault(require("../modal/patientHmo.model"));
// doctor doctor get patient HMO order
const doctorgetPatientHmoPending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const {} = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pendingHmo = yield patientHmo_model_1.default.find({ clinicCode: doctor.clinicCode, status: "pending" }).sort({ createdAt: -1 });
        return res.status(200).json({
            pendingHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorgetPatientHmoPending = doctorgetPatientHmoPending;
// doctor get patient Hmo approved
const doctorgetPatientHmoApproved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const {} = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const approvedHmo = yield patientHmo_model_1.default.find({ clinicCode: doctor.clinicCode, status: "approved" }).sort({ createdAt: -1 });
        return res.status(200).json({
            approvedHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorgetPatientHmoApproved = doctorgetPatientHmoApproved;
// doctor get patient Hmo denied
const doctorgetPatientHmodenied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const {} = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const deniedHmo = yield patientHmo_model_1.default.find({ clinicCode: doctor.clinicCode, status: "denied" }).sort({ createdAt: -1 });
        return res.status(200).json({
            deniedHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorgetPatientHmodenied = doctorgetPatientHmodenied;
