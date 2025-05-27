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
exports.adminGiveDoctorClinicCodebyPhoneNumber = exports.adminGiveDoctorClinicCode = exports.adminGetDoctorRequestClinicCode = exports.adminGetSinglePatientUnderDoctorOder = exports.adminGetPatientUnderDoctor = exports.adminGetSingleDoctorOder = exports.adminGetDoctor = void 0;
const express_validator_1 = require("express-validator");
const patient_reg_model_1 = __importDefault(require("../../doctor/modal/patient_reg.model"));
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
const send_email_utility_1 = require("../../utils/send_email_utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
// admin get doctor detail 
const adminGetDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctors = yield doctor_reg_modal_1.default.find()
            .skip(skip)
            .limit(limit);
        const totalDoctor = yield doctor_reg_modal_1.default.countDocuments(); // Get the total number of documents
        return res.status(200).json({
            doctors,
            currentPage: page,
            totalPages: Math.ceil(totalDoctor / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctor = adminGetDoctor;
// admin get single doctor detail 
const adminGetSingleDoctorOder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { doctorId } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctor = yield doctor_reg_modal_1.default.findOne({ _id: doctorId });
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "incorrect doctor ID" });
        }
        return res.status(200).json({
            doctor
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetSingleDoctorOder = adminGetSingleDoctorOder;
// admin get get patient under  doctor detail 
const adminGetPatientUnderDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { clinicCode, page, limit } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const patients = yield patient_reg_model_1.default.find({ clinicCode })
            .skip(skip)
            .limit(limit);
        const totalpatient = yield patient_reg_model_1.default.countDocuments(); // Get the total number of documents
        return res.status(200).json({
            patients,
            currentPage: page,
            totalPages: Math.ceil(totalpatient / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetPatientUnderDoctor = adminGetPatientUnderDoctor;
// admin get single patient under doctor detail 
const adminGetSinglePatientUnderDoctorOder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { clinicCode, patientId } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const patient = yield patient_reg_model_1.default.findOne({ _id: patientId, clinicCode });
        if (!patient) {
            return res
                .status(401)
                .json({ message: "incorrect patient ID" });
        }
        return res.status(200).json({
            patient
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetSinglePatientUnderDoctorOder = adminGetSinglePatientUnderDoctorOder;
// admin get doctor that request clinic Code 
const adminGetDoctorRequestClinicCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const doctors = yield doctor_reg_modal_1.default.find({ requestClinicCode: "request" })
            .skip(skip)
            .limit(limit);
        const totalDoctor = yield doctor_reg_modal_1.default.countDocuments(); // Get the total number of documents
        return res.status(200).json({
            doctors,
            currentPage: page,
            totalPages: Math.ceil(totalDoctor / limit),
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGetDoctorRequestClinicCode = adminGetDoctorRequestClinicCode;
// admin give doctor clinic Code by email
const adminGiveDoctorClinicCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctor = yield doctor_reg_modal_1.default.findOne({ email });
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "incorrect email" });
        }
        if (!doctor.superDoctor) {
            return res
                .status(401)
                .json({ message: "this email is not for super admin" });
        }
        // if (doctor.clinicCode !== '') {
        //     return res
        //     .status(401)
        //     .json({ message: "clinic code already exist" });
        // }
        // const date = new Date()
        // const numberString = Math.abs(date.getTime()).toString();
        // const clinicCode = numberString.slice(-6);
        doctor.clinicVerification.isVerified = true;
        doctor.requestClinicCode = 'given';
        yield doctor.save();
        let emailData = {
            emailTo: email,
            subject: "Theraswift clinic code",
            otp: doctor.clinicCode,
            firstName: doctor.firstName,
        };
        (0, send_email_utility_1.sendEmail)(emailData);
        return res.status(200).json({
            message: "clinic code sent to your email"
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGiveDoctorClinicCode = adminGiveDoctorClinicCode;
// admin give doctor clinic Code by phone number
const adminGiveDoctorClinicCodebyPhoneNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { mobileNumber } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        const doctor = yield doctor_reg_modal_1.default.findOne({ phoneNumber: phonenumber });
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "incorrect phnone number" });
        }
        if (!doctor.superDoctor) {
            return res
                .status(401)
                .json({ message: "this email is not for super admin" });
        }
        // if (doctor.clinicCode !== '') {
        //     return res
        //     .status(401)
        //     .json({ message: "clinic code already exist" });
        // }
        // const date = new Date()
        // const numberString = Math.abs(date.getTime()).toString();
        // const clinicCode = numberString.slice(-6);
        doctor.clinicVerification.isVerified = true;
        doctor.requestClinicCode = 'given';
        yield doctor.save();
        let sms = `Hello ${doctor.firstName} your Theraswift clinic code is ${doctor.clinicCode}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({
            message: `clinic code ${doctor.clinicCode} sent to your phone number`
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminGiveDoctorClinicCodebyPhoneNumber = adminGiveDoctorClinicCodebyPhoneNumber;
