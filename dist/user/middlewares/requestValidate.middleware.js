"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddressParams = exports.validatefamilymemberParams = exports.validateUserCheckOutVerificationParams = exports.validateUserCheckOutParams = exports.validateUserCartParams = exports.validateSearchMedicationByNameFRomDosageParams = exports.validateSearchMedicationByNameFRomParams = exports.validateSearchMedicationByNameParams = exports.validateUserAddMedicationParams = exports.validateAddMedicationParams = exports.validatePhoneLoginParams = exports.validateEmailLoginParams = exports.validatePhoneNumberResetPasswordParams = exports.validateEmailResetPasswordParams = exports.validatePhoneNumberVerificatioParams = exports.validateEmailVerificatioParams = exports.validatePhoneNumberParams = exports.validateEmailParams = exports.validateSignupParams = void 0;
const express_validator_1 = require("express-validator");
exports.validateSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("dateOfBirth").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)("passwordConfirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"])
        .withMessage("Gender must be either male or female"),
    (0, express_validator_1.body)("operatingLocation")
        .isIn(["Lagos", "Ogun"])
        .withMessage("operating location must be either Lagos or Ogun"),
];
exports.validateEmailParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validatePhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
];
exports.validateEmailVerificatioParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validatePhoneNumberVerificatioParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateEmailResetPasswordParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatePhoneNumberResetPasswordParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateEmailLoginParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatePhoneLoginParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateAddMedicationParams = [
    (0, express_validator_1.body)("userMedicationId").notEmpty(),
];
exports.validateUserAddMedicationParams = [
    (0, express_validator_1.body)("medicationId").notEmpty(),
];
exports.validateSearchMedicationByNameParams = [
    (0, express_validator_1.body)("name").notEmpty(),
];
exports.validateSearchMedicationByNameFRomParams = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("form").notEmpty(),
];
exports.validateSearchMedicationByNameFRomDosageParams = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("form").notEmpty(),
    (0, express_validator_1.body)("dosage").notEmpty(),
];
exports.validateUserCartParams = [
    (0, express_validator_1.body)("cartId").notEmpty(),
];
exports.validateUserCheckOutParams = [
    (0, express_validator_1.body)("deliveryDate").notEmpty(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("dateOfBirth").notEmpty(),
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"])
];
exports.validateUserCheckOutVerificationParams = [
    (0, express_validator_1.body)("reference").notEmpty(),
    (0, express_validator_1.body)("orderId").notEmpty(),
];
exports.validatefamilymemberParams = [
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("dateOfBirth").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"])
        .withMessage("Gender must be either male or female"),
];
exports.validateAddressParams = [
    (0, express_validator_1.body)("streetAddress").notEmpty(),
    (0, express_validator_1.body)("streetNO").notEmpty(),
    (0, express_validator_1.body)("LGA").notEmpty(),
    (0, express_validator_1.body)("DeliveryInstruction").notEmpty(),
];
