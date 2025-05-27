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
exports.userPhoneNumberVerificationController = exports.userSendPhoneNumberController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const sendSms_utility_1 = require("../../utils/sendSms.utility");
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const patient_reg_model_1 = __importDefault(require("../../doctor/modal/patient_reg.model"));
const awaitingMedication_model_1 = __importDefault(require("../../admin/models/awaitingMedication.model"));
const medication_model_1 = __importDefault(require("../models/medication.model"));
const medication_model_2 = __importDefault(require("../../admin/models/medication.model"));
//user send email /////////////
const userSendPhoneNumberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield userReg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid mobile number" });
        }
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        user.phoneNumberOtp = {
            otp,
            createdTime,
            verified: false
        };
        yield (user === null || user === void 0 ? void 0 : user.save());
        let sms = `Hello ${user.firstName} your Theraswift mobile number verification OTP is ${otp}`;
        let data = { to: phonenumber, sms };
        (0, sendSms_utility_1.sendSms)(data);
        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userSendPhoneNumberController = userSendPhoneNumberController;
//user verified phone number /////////////
const userPhoneNumberVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, otp } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // try find user with the same email
        const user = yield userReg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid mobile number" });
        }
        if (user.phoneNumberOtp.otp != otp) {
            return res
                .status(401)
                .json({ message: "invalid otp" });
        }
        if (user.phoneNumberOtp.verified) {
            return res
                .status(401)
                .json({ message: "mobile number already verified" });
        }
        const timeDiff = new Date().getTime() - user.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > otpGenerator_1.OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }
        user.phoneNumberOtp.verified = true;
        yield user.save();
        const checkAwaitingMeds = yield awaitingMedication_model_1.default.find({ phoneNumber: phonenumber });
        if (checkAwaitingMeds.length > 0) {
            for (let i = 0; i < checkAwaitingMeds.length; i++) {
                const checkAwaitingMed = checkAwaitingMeds[i];
                const medication = yield medication_model_2.default.findOne({ _id: checkAwaitingMed.medicationId });
                if (!medication)
                    continue;
                const patient = yield patient_reg_model_1.default.findOne({ _id: checkAwaitingMed.patientId });
                if (!patient)
                    continue;
                //if medication those not exist
                const userMedication = new medication_model_1.default({
                    userId: user._id,
                    medicationId: medication._id,
                    prescriptionStatus: false,
                    doctor: patient.doctorId,
                    clinicCode: patient.clinicCode
                });
                const saveUserMedication = yield userMedication.save();
                // check if the medication is in database
                const deleteAwaitMed = yield awaitingMedication_model_1.default.findOneAndDelete({ _id: checkAwaitingMed._id }, { new: true });
                if (!deleteAwaitMed)
                    continue;
            }
        }
        return res.json({ message: "mobile number verified successfully" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userPhoneNumberVerificationController = userPhoneNumberVerificationController;
