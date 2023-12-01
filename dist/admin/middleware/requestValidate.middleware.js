"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrderParams = exports.validateUserParams = exports.validateMedicationDeleteParams = exports.validateMedicationEditParams = exports.validateMedicationParams = exports.validateResetPassword = exports.validateEmail = exports.validateAdminSigninParams = void 0;
const express_validator_1 = require("express-validator");
exports.validateAdminSigninParams = [
    (0, express_validator_1.body)("email").isEmail(),
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
    (0, express_validator_1.body)("strength").notEmpty(),
    (0, express_validator_1.body)("quantity").notEmpty(),
    (0, express_validator_1.body)("prescriptionRequired")
        .isIn([true, false])
        .withMessage("prescriptionRequired must be either true or false"),
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
