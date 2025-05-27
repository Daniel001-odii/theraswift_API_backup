"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeliveryIdParams = exports.validateDriverPickUpDeliveryGoodsParams = exports.validateDriverInitiateDeliveryParams = exports.validatePhoneNumberResetPasswordParams = exports.validateEmailResetPasswordParams = exports.validatePhoneNumberSignInParams = exports.validateEmailSignInParams = exports.validateVerifyPhoneNumberParams = exports.validateSendPhoneNumberParams = exports.validateVerifyEmailParams = exports.validateSendEmailParams = exports.validateSignupParams = void 0;
const express_validator_1 = require("express-validator");
exports.validateSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    // body("passwordConfirmation").custom((value, { req }) => {
    //   if (value !== req.body.password) {
    //     throw new Error("Passwords do not match");
    //   }
    //   return true;
    // }),
    (0, express_validator_1.body)("phoneNumber").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"])
        .withMessage("Gender must be either male or female"),
    (0, express_validator_1.body)("city").notEmpty(),
    (0, express_validator_1.body)("licensePlate").notEmpty(),
];
exports.validateSendEmailParams = [
    (0, express_validator_1.body)("email").isEmail(),
];
exports.validateVerifyEmailParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateSendPhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
];
exports.validateVerifyPhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("otp").notEmpty(),
];
exports.validateEmailSignInParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
];
exports.validatePhoneNumberSignInParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
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
exports.validateDriverInitiateDeliveryParams = [
    (0, express_validator_1.body)("enoughFuel")
        .isIn(["yes", "no"])
        .withMessage("enoughFuel must be either yes or no"),
    (0, express_validator_1.body)("phoneCharge")
        .isIn(["yes", "no"])
        .withMessage("phoneCharge must be either yes or no"),
    (0, express_validator_1.body)("theraswitId")
        .isIn(["yes", "no"])
        .withMessage("theraswitId must be either yes or no"),
];
exports.validateDriverPickUpDeliveryGoodsParams = [
    (0, express_validator_1.body)("userId").notEmpty(),
    (0, express_validator_1.body)("orderId").notEmpty(),
    (0, express_validator_1.body)("deliveryId").notEmpty(),
];
exports.validateDeliveryIdParams = [
    (0, express_validator_1.body)("deliveryId").notEmpty(),
];
