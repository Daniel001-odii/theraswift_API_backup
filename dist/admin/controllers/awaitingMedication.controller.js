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
exports.adminSendingPatientOrderToSms = exports.adminSendingPatientOrderToEmail = void 0;
const express_validator_1 = require("express-validator");
const patient_reg_model_1 = __importDefault(require("../../doctor/modal/patient_reg.model"));
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
const patientOrder_model_1 = __importDefault(require("../../doctor/modal/patientOrder.model"));
const medication_model_1 = __importDefault(require("../models/medication.model"));
const awaitingMedication_model_1 = __importDefault(require("../models/awaitingMedication.model"));
const sendEmailGeneral_1 = require("../../utils/sendEmailGeneral");
const sendLinkTemlate_1 = require("../../templates/admin/sendLinkTemlate");
const otpGenerator_1 = require("../../utils/otpGenerator");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const userReg_model_1 = __importDefault(require("../../user/models/userReg.model"));
const medication_model_2 = __importDefault(require("../../user/models/medication.model"));
// admin send order to patient through email
const adminSendingPatientOrderToEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { patientId,
        // hmoClinicCode
         } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const patient = yield patient_reg_model_1.default.findOne({ _id: patientId });
        if (!patient) {
            return res
                .status(401)
                .json({ message: "incorrect patient ID" });
        }
        const orders = yield patientOrder_model_1.default.find({ patientId: patient._id, status: "progress", });
        if (orders.length < 1) {
            return res
                .status(401)
                .json({ message: "no order for this patient" });
        }
        const checkUser = yield userReg_model_1.default.findOne({ email: patient.email });
        if (checkUser === null || checkUser === void 0 ? void 0 : checkUser.emailOtp.verified) {
            let count = 0;
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const singleOrder = yield patientOrder_model_1.default.findOne({ _id: order._id });
                if (!singleOrder)
                    continue;
                const medication = yield medication_model_1.default.findOne({ _id: singleOrder.medicationId });
                if (!medication)
                    continue;
                singleOrder.status = "delivered";
                yield singleOrder.save();
                //if medication those not exist
                const userMedication = new medication_model_2.default({
                    userId: checkUser._id,
                    medicationId: medication._id,
                    prescriptionStatus: false,
                    doctor: patient.doctorId,
                    clinicCode: patient.clinicCode
                });
                const saveUserMedication = yield userMedication.save();
                count++;
            }
            if (count < 1) {
                return res
                    .status(401)
                    .json({ message: "no order for this patient" });
            }
        }
        else {
            let count = 0;
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const singleOrder = yield patientOrder_model_1.default.findOne({ _id: order._id });
                if (!singleOrder)
                    continue;
                const medication = yield medication_model_1.default.findOne({ _id: singleOrder.medicationId });
                if (!medication)
                    continue;
                singleOrder.status = "delivered";
                yield singleOrder.save();
                const newAwaitingMed = new awaitingMedication_model_1.default({
                    patientId,
                    medicationId: medication._id,
                    email: patient.email,
                    phoneNumber: patient.phoneNumber
                });
                yield newAwaitingMed.save();
                count++;
            }
            if (count < 1) {
                return res
                    .status(401)
                    .json({ message: "no order for this patient" });
            }
        }
        const html = (0, sendLinkTemlate_1.htmlMailLinkTemplate)(patient.firstName, otpGenerator_1.SINGUP_LINK);
        yield (0, sendEmailGeneral_1.sendEmail)({
            emailTo: patient.email,
            subject: 'link to signup with theraswift',
            html
        });
        return res.status(200).json({
            message: 'email sent to successfully'
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminSendingPatientOrderToEmail = adminSendingPatientOrderToEmail;
// admin send order to patient through sms
const adminSendingPatientOrderToSms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { patientId,
        // hmoClinicCode
         } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const patient = yield patient_reg_model_1.default.findOne({ _id: patientId }).populate('doctorId');
        if (!patient) {
            return res
                .status(401)
                .json({ message: "incorrect patient ID" });
        }
        const doctor = yield doctor_reg_modal_1.default.findOne({ _id: patient.doctorId });
        const orders = yield patientOrder_model_1.default.find({ patientId: patient._id, status: "progress", });
        if (orders.length < 1) {
            return res
                .status(401)
                .json({ message: "no order for this patient" });
        }
        const checkUser = yield userReg_model_1.default.findOne({ mobileNumber: patient.phoneNumber });
        if (checkUser === null || checkUser === void 0 ? void 0 : checkUser.phoneNumberOtp.verified) {
            let count = 0;
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const singleOrder = yield patientOrder_model_1.default.findOne({ _id: order._id });
                if (!singleOrder)
                    continue;
                const medication = yield medication_model_1.default.findOne({ _id: singleOrder.medicationId });
                if (!medication)
                    continue;
                singleOrder.status = "delivered";
                yield singleOrder.save();
                //if medication those not exist
                const userMedication = new medication_model_2.default({
                    userId: checkUser._id,
                    medicationId: medication._id,
                    prescriptionStatus: false,
                    doctor: patient.doctorId,
                    clinicCode: patient.clinicCode
                });
                const saveUserMedication = yield userMedication.save();
                count++;
            }
            if (count < 1) {
                return res
                    .status(401)
                    .json({ message: "no order for this patient" });
            }
        }
        else {
            let count = 0;
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const singleOrder = yield patientOrder_model_1.default.findOne({ _id: order._id });
                if (!singleOrder)
                    continue;
                const medication = yield medication_model_1.default.findOne({ _id: singleOrder.medicationId });
                if (!medication)
                    continue;
                singleOrder.status = "delivered";
                yield singleOrder.save();
                const newAwaitingMed = new awaitingMedication_model_1.default({
                    patientId,
                    medicationId: medication._id,
                    email: patient.email,
                    phoneNumber: patient.phoneNumber
                });
                yield newAwaitingMed.save();
                count++;
            }
            if (count < 1) {
                return res
                    .status(401)
                    .json({ message: "no order for this patient" });
            }
        }
        let sms = `Hi ${patient.firstName}, we just recieved your prescription from ${doctor === null || doctor === void 0 ? void 0 : doctor.firstName} copy link below on browser to schedule your free delivery ${otpGenerator_1.SINGUP_LINK}  ${otpGenerator_1.SINGIN_LINK}`;
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(patient.phoneNumber.toString());
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({
            message: 'email sent to successfully'
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminSendingPatientOrderToSms = adminSendingPatientOrderToSms;
