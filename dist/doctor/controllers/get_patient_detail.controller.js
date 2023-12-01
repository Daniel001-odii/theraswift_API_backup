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
exports.doctorGetSingleRegisteredPatient = exports.doctorGetAllRegisteredPatient = void 0;
const express_validator_1 = require("express-validator");
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
//doctor get all registered patient /////////////
const doctorGetAllRegisteredPatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor;
        const doctorPatients = yield patient_reg_model_1.default.find({ doctorId: doctor._id });
        return res.status(200).json({
            message: "success",
            patients: doctorPatients
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGetAllRegisteredPatient = doctorGetAllRegisteredPatient;
//doctor get single registered patient /////////////
const doctorGetSingleRegisteredPatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctor = req.doctor;
        const doctorPatient = yield patient_reg_model_1.default.findOne({ _id: id, doctorId: doctor._id });
        return res.status(200).json({
            message: "success",
            patient: doctorPatient
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorGetSingleRegisteredPatient = doctorGetSingleRegisteredPatient;
