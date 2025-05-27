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
exports.doctorRequestCodeByPhoneNumberController = exports.doctorRequestCodeByEmailController = void 0;
const express_validator_1 = require("express-validator");
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
//doctor request for clinic code by email /////////////
const doctorRequestCodeByEmailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find doctor with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ email });
        // check if doctor exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid email" });
        }
        if (!doctor.emailOtp.verified) {
            return res.status(401).json({ message: "email not verified." });
        }
        if (!doctor.superDoctor) {
            return res.status(401).json({ message: "you can't request clinic code." });
        }
        if (doctor.requestClinicCode === 'request' || doctor.requestClinicCode === 'given') {
            return res.status(401).json({ message: "clinic code requested already" });
        }
        const date = new Date();
        const numberString = Math.abs(date.getTime()).toString();
        const clinicCode = numberString.slice(-6);
        doctor.clinicCode = clinicCode;
        doctor.requestClinicCode = 'request',
            yield doctor.save();
        // return access token
        res.json({
            message: "request sent successfully",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorRequestCodeByEmailController = doctorRequestCodeByEmailController;
//doctor request for clinic code by phone number /////////////
const doctorRequestCodeByPhoneNumberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // try find user with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid phonenumber" });
        }
        if (!doctor.phoneNumberOtp.verified) {
            return res.status(401).json({ message: "mobile number not verified." });
        }
        if (!doctor.superDoctor) {
            return res.status(401).json({ message: "you can't request clinic code." });
        }
        if (doctor.requestClinicCode === 'request' || doctor.requestClinicCode === 'given') {
            return res.status(401).json({ message: "clinic code requested already" });
        }
        const date = new Date();
        const numberString = Math.abs(date.getTime()).toString();
        const clinicCode = numberString.slice(-6);
        doctor.clinicCode = clinicCode;
        doctor.requestClinicCode = 'request',
            yield doctor.save();
        // return access token
        res.json({
            message: "request sent successfully"
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorRequestCodeByPhoneNumberController = doctorRequestCodeByPhoneNumberController;
