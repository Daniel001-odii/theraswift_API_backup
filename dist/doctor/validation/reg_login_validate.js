"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatientOderHmoperson = exports.validatePatientPrescriptionidperson = exports.validateDrugPrescription = exports.validateResetPassword = exports.validateEmail = exports.validatePatientidperson = exports.validatePatientid = exports.validatePatientRegParams = exports.validateDoctorSigninParams = exports.validateDoctorSignupParams = void 0;
const express_validator_1 = require("express-validator");
exports.validateDoctorSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)("title").notEmpty(),
    (0, express_validator_1.body)("organization")
        .isIn(["clinic", "hospital", "HMO"])
        .withMessage("Oganization must be either clinic, hospital or HMO"),
];
exports.validateDoctorSigninParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatePatientRegParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("surname").notEmpty(),
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"])
        .withMessage("gender must be either male or female"),
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("dateOFBirth").notEmpty(),
];
exports.validatePatientid = [
    (0, express_validator_1.body)("id").notEmpty(),
];
exports.validatePatientidperson = [
    (0, express_validator_1.body)("patientId").notEmpty(),
];
exports.validateEmail = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validateResetPassword = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateDrugPrescription = [
    (0, express_validator_1.body)("patientId").notEmpty(),
    (0, express_validator_1.body)("medicationId").notEmpty(),
    (0, express_validator_1.body)("dosage").notEmpty(),
    (0, express_validator_1.body)("frequency").notEmpty(),
    (0, express_validator_1.body)("route").notEmpty(),
    (0, express_validator_1.body)("duration").notEmpty(),
];
exports.validatePatientPrescriptionidperson = [
    (0, express_validator_1.body)("prescriptionId").notEmpty(),
];
exports.validatePatientOderHmoperson = [
    (0, express_validator_1.body)("patientId").notEmpty(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("surname").notEmpty(),
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
    (0, express_validator_1.body)("EnroleNumber").notEmpty(),
    (0, express_validator_1.body)("email").notEmpty(),
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("medicalCode").notEmpty(),
    (0, express_validator_1.body)("medicalRecord").notEmpty(),
    (0, express_validator_1.body)("hmoID").notEmpty(),
];
