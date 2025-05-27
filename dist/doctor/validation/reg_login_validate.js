"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHmoTakeActionOnPatientOrderParams = exports.validateHmoGetPatientOrderParams = exports.validateHmoActionOnPatientSignupParams = exports.validatePatientOderHmoperson = exports.validatePatientPrescriptionidperson = exports.validateDrugPrescription = exports.validateSearchMedByNameFormDosage = exports.validateSearchMedByNameForm = exports.validateSearchMedByName = exports.validateResetPasswordByPhoneNumber = exports.validateResetPassword = exports.validatePhonNumber = exports.validateEmail = exports.validateDeletePatientprescription = exports.validatePatientidQueryperson = exports.validatePatientidperson = exports.validatePatientid = exports.validatePatientRegParams = exports.validateDoctorSigninPhoneNumberParams = exports.validateDoctorSigninParams = exports.validateDoctorVerifiedPhoneNumberParams = exports.validateDoctorVerifiedEmailParams = exports.validateDoctorSendPhoneNumberParams = exports.validateDoctorSendEmailParams = exports.validateGetDoctorParams = exports.validateDoctorSignupParams = void 0;
const express_validator_1 = require("express-validator");
exports.validateDoctorSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)("title").notEmpty(),
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
    //body("clinicCode").notEmpty(),
    (0, express_validator_1.body)("addresss").notEmpty(),
    (0, express_validator_1.body)("speciality").notEmpty(),
    (0, express_validator_1.body)("regNumber").notEmpty(),
    (0, express_validator_1.body)("organization")
        .isIn(["clinic", "hospital", "HMO"])
        .withMessage("Oganization must be either clinic, hospital or HMO"),
];
exports.validateGetDoctorParams = [
    (0, express_validator_1.query)("doctorId").notEmpty().withMessage("Doctor ID is required"),
];
exports.validateDoctorSendEmailParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validateDoctorSendPhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
];
exports.validateDoctorVerifiedEmailParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateDoctorVerifiedPhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateDoctorSigninParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateDoctorSigninPhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
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
exports.validatePatientidQueryperson = [
    (0, express_validator_1.query)("patientId").notEmpty(),
];
exports.validateDeletePatientprescription = [
    (0, express_validator_1.body)("patientId").notEmpty(),
    (0, express_validator_1.body)("prescriptionId").notEmpty(),
];
exports.validateEmail = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validatePhonNumber = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
];
exports.validateResetPassword = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateResetPasswordByPhoneNumber = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateSearchMedByName = [
    (0, express_validator_1.query)("name").notEmpty(),
];
exports.validateSearchMedByNameForm = [
    (0, express_validator_1.query)("name").notEmpty(),
    (0, express_validator_1.query)("form").notEmpty(),
];
exports.validateSearchMedByNameFormDosage = [
    (0, express_validator_1.query)("name").notEmpty(),
    (0, express_validator_1.query)("form").notEmpty(),
    (0, express_validator_1.query)("dosage").notEmpty(),
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
exports.validateHmoActionOnPatientSignupParams = [
    (0, express_validator_1.body)("hmoID").notEmpty(),
    (0, express_validator_1.body)("status")
        .isIn(["approved", "denied"])
        .withMessage("status must be approved or denied"),
];
exports.validateHmoGetPatientOrderParams = [
    (0, express_validator_1.query)("patientId").notEmpty(),
];
exports.validateHmoTakeActionOnPatientOrderParams = [
    (0, express_validator_1.body)("patientId").notEmpty(),
    (0, express_validator_1.body)("orderId").notEmpty(),
    (0, express_validator_1.body)("amount").notEmpty(),
];
