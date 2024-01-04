"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatFrequenceAskParams = exports.validatEssentialProuctIdParams = exports.validatEssentialCategoryParams = exports.validateOrderParams = exports.validateUserParams = exports.validateMedicationDeleteParams = exports.validateMedicationEditParams = exports.validateMedicationParams = exports.validateResetPasswordByPhoneNumber = exports.validatePhonNumber = exports.validateResetPassword = exports.validateEmail = exports.validateAdminSigninPhonNumberParams = exports.validateAdminSigninParams = exports.validateVerifyPhoneNumbweParams = exports.validateSendPhoneNumberParams = exports.validateVerifyEmailEmailigninParams = exports.validateSendEmailigninParams = exports.validateSignupParams = void 0;
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
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"])
        .withMessage("Gender must be either male or female"),
    (0, express_validator_1.body)("address").notEmpty(),
];
exports.validateSendEmailigninParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validateVerifyEmailEmailigninParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateSendPhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
];
exports.validateVerifyPhoneNumbweParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateAdminSigninParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateAdminSigninPhonNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateEmail = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validateResetPassword = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatePhonNumber = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
];
exports.validateResetPasswordByPhoneNumber = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("otp").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validateMedicationParams = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("manufacturer").notEmpty(),
    (0, express_validator_1.body)("price").notEmpty(),
    (0, express_validator_1.body)("strength").notEmpty(),
    (0, express_validator_1.body)("quantity").notEmpty(),
    (0, express_validator_1.body)("prescriptionRequired")
        .isIn([true, false])
        .withMessage("prescriptionRequired must be either true or false"),
    (0, express_validator_1.body)("medInfo").notEmpty(),
];
exports.validateMedicationEditParams = [
    (0, express_validator_1.body)("medicationId").notEmpty(),
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("price").notEmpty(),
    (0, express_validator_1.body)("quantity").notEmpty(),
    (0, express_validator_1.body)("prescriptionRequired")
        .isIn(["required", "not required", "neccessary"])
        .withMessage("prescriptionRequired must be either required, not required or neccessary"),
    (0, express_validator_1.body)("form").notEmpty(),
    (0, express_validator_1.body)("ingredient").notEmpty(),
    (0, express_validator_1.body)("medInfo").notEmpty(),
];
exports.validateMedicationDeleteParams = [
    (0, express_validator_1.body)("medicationId").notEmpty(),
];
exports.validateUserParams = [
    (0, express_validator_1.body)("userId").notEmpty(),
];
exports.validateOrderParams = [
    (0, express_validator_1.body)("orderId").notEmpty(),
];
exports.validatEssentialCategoryParams = [
    (0, express_validator_1.body)("name").notEmpty(),
];
exports.validatEssentialProuctIdParams = [
    (0, express_validator_1.body)("productId").notEmpty(),
];
exports.validatFrequenceAskParams = [
    (0, express_validator_1.body)("question").notEmpty(),
    (0, express_validator_1.body)("answer").notEmpty(),
];
