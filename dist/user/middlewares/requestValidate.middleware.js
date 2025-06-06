"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnssntialcartIDtParams = exports.validateEnssntialCarttParams = exports.validateEnssntialProoudtParams = exports.validateDeliveryStateParams = exports.validateAddressParams = exports.validatefamilymemberParams = exports.validateUserCheckOutVerificationParams = exports.validateUserCheckOutDirectParams = exports.validateUserCheckOutParams = exports.validateUserCartQueryParams = exports.validateUserCartParams = exports.validateSearchMedicationByNameFRomDosageParams = exports.validateSearchMedicationByNameFRomParams = exports.validateGetMedicationByIdParams = exports.validateSearchMedicationByNameParams = exports.validateUserAddMedicationParams = exports.validateRemovedMedicationParams = exports.validateAddMedicationParams = exports.validatePhoneLoginParams = exports.validateEmailLoginParams = exports.validatePhoneNumberResetPasswordParams = exports.validateEmailResetPasswordParams = exports.validatePhoneNumberVerificatioParams = exports.validateEmailVerificatioParams = exports.validatePhoneNumberParams = exports.validateEmailParams = exports.validateSignupParams = void 0;
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
    (0, express_validator_1.body)("address").notEmpty(),
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
exports.validateRemovedMedicationParams = [
    (0, express_validator_1.body)("userMedicationId").notEmpty(),
    (0, express_validator_1.body)("reason").notEmpty(),
];
exports.validateUserAddMedicationParams = [
    (0, express_validator_1.body)("medicationId").notEmpty(),
];
exports.validateSearchMedicationByNameParams = [
    (0, express_validator_1.query)("name").notEmpty(),
];
exports.validateGetMedicationByIdParams = [
    (0, express_validator_1.query)("meidcationId").notEmpty(),
];
exports.validateSearchMedicationByNameFRomParams = [
    (0, express_validator_1.query)("name").notEmpty(),
    (0, express_validator_1.query)("form").notEmpty(),
];
exports.validateSearchMedicationByNameFRomDosageParams = [
    (0, express_validator_1.query)("name").notEmpty(),
    (0, express_validator_1.query)("form").notEmpty(),
    (0, express_validator_1.query)("dosage").notEmpty(),
];
exports.validateUserCartParams = [
    (0, express_validator_1.body)("cartId").notEmpty(),
];
exports.validateUserCartQueryParams = [
    (0, express_validator_1.query)("cartId").notEmpty(),
];
exports.validateUserCheckOutParams = [
    (0, express_validator_1.body)("deliveryDate").notEmpty(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("dateOfBirth").notEmpty(),
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"]),
    /*  body("others").isArray().custom((value: any[]) => {
       // Check if the 'others' field is an array
       if (!Array.isArray(value)) {
         throw new Error('Invalid format for the "others" field.');
       }
       return true;
     }), */
];
exports.validateUserCheckOutDirectParams = [
    (0, express_validator_1.body)("deliveryDate").notEmpty(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("dateOfBirth").notEmpty(),
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"]),
    (0, express_validator_1.body)("others").isArray().custom((value) => {
        // Check if the 'others' field is an array
        if (!Array.isArray(value)) {
            throw new Error('Invalid format for the "others" field.');
        }
        return true;
    }),
    (0, express_validator_1.body)("medicationId").notEmpty(),
    (0, express_validator_1.body)("type")
        .isIn(["med", "ess"]),
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
    (0, express_validator_1.body)("doorMan")
        .isIn([true, false])
        .withMessage("doorMan must be either true or false"),
    (0, express_validator_1.body)("handDeliver")
        .isIn([true, false])
        .withMessage("handDeliver must be either true or false"),
    (0, express_validator_1.body)("state").notEmpty(),
];
exports.validateDeliveryStateParams = [
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("state")
        .isIn(["Lagos", "Ogun"])
        .withMessage("delivery state available are Lagos and Ogun"),
];
exports.validateEnssntialProoudtParams = [
    (0, express_validator_1.query)("categoryId").notEmpty(),
];
exports.validateEnssntialCarttParams = [
    (0, express_validator_1.body)("productId").notEmpty(),
];
exports.validateEnssntialcartIDtParams = [
    (0, express_validator_1.body)("enssentialCartId").notEmpty(),
];
