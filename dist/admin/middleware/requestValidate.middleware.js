"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFormData = exports.validatepatientIdParams = exports.validateAdminGettOrderToHmoParams = exports.validateAdminSentOrderToHmoParams = exports.validatHmoIdParams = exports.validateDoctorPhoneNumberParams = exports.validateDoctorEmailParams = exports.validatSinglePatientUnderDoctorIdParams = exports.validatPatientUnderDoctorIdParams = exports.validatDoctorIdParams = exports.validatFrequenceAskParams = exports.validatEssentialProuctIdQueryarams = exports.validatEssentialProuctIdParams = exports.validateCategoryIDParams = exports.validatEssentialCategoryParams = exports.validateOrderPostParams = exports.validateOrderParams = exports.validateUserParams = exports.validateMedicationDeleteParams = exports.validateMedicationEditParams = exports.validateMedicationParams = exports.validateResetPasswordByPhoneNumber = exports.validatePhonNumber = exports.validateResetPassword = exports.validateEmail = exports.validateAdminSigninPhonNumberParams = exports.validateAdminSigninParams = exports.validateVerifyPhoneNumbweParams = exports.validateSendPhoneNumberParams = exports.validateVerifyEmailEmailigninParams = exports.validateSendEmailigninParams = exports.validateSignupParams = void 0;
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
    (0, express_validator_1.body)("price").isNumeric(),
    (0, express_validator_1.body)("quantity").notEmpty(),
    (0, express_validator_1.body)("form").notEmpty(),
    (0, express_validator_1.body)("prescriptionRequired")
        .isIn(['required', 'not required', 'neccessary'])
        .withMessage("prescriptionRequired must be either required, not required or neccessary"),
    (0, express_validator_1.body)("ingredient").notEmpty(),
    (0, express_validator_1.body)("quantityForUser").notEmpty(),
    (0, express_validator_1.body)("inventoryQuantity").notEmpty(),
    (0, express_validator_1.body)("expiredDate").isDate(),
    (0, express_validator_1.body)("category").notEmpty(),
    (0, express_validator_1.body)("medInfo").notEmpty(),
];
exports.validateMedicationEditParams = [
    (0, express_validator_1.body)("medicationId").notEmpty(),
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("price").isNumeric(),
    (0, express_validator_1.body)("quantity").notEmpty(),
    (0, express_validator_1.body)("form").notEmpty(),
    (0, express_validator_1.body)("prescriptionRequired")
        .isIn(['required', 'not required', 'neccessary'])
        .withMessage("prescriptionRequired must be either required, not required or neccessary"),
    (0, express_validator_1.body)("ingredient").notEmpty(),
    (0, express_validator_1.body)("quantityForUser").notEmpty(),
    (0, express_validator_1.body)("inventoryQuantity").notEmpty(),
    (0, express_validator_1.body)("expiredDate").notEmpty(),
    (0, express_validator_1.body)("category").notEmpty(),
    (0, express_validator_1.body)("medInfo").notEmpty(),
];
exports.validateMedicationDeleteParams = [
    (0, express_validator_1.body)("medicationId").notEmpty(),
];
exports.validateUserParams = [
    (0, express_validator_1.query)("userId").notEmpty(),
];
exports.validateOrderParams = [
    (0, express_validator_1.query)("orderId").notEmpty(),
];
exports.validateOrderPostParams = [
    (0, express_validator_1.body)("orderId").notEmpty(),
];
exports.validatEssentialCategoryParams = [
    (0, express_validator_1.body)("name").notEmpty(),
];
exports.validateCategoryIDParams = [
    (0, express_validator_1.body)("categoryId").notEmpty(),
];
exports.validatEssentialProuctIdParams = [
    (0, express_validator_1.body)("productId").notEmpty(),
];
exports.validatEssentialProuctIdQueryarams = [
    (0, express_validator_1.query)("productId").notEmpty(),
];
exports.validatFrequenceAskParams = [
    (0, express_validator_1.body)("question").notEmpty(),
    (0, express_validator_1.body)("answer").notEmpty(),
];
//////////////////////
/// Doctor //////////
/////////////////
exports.validatDoctorIdParams = [
    (0, express_validator_1.query)("doctorId").notEmpty(),
];
exports.validatPatientUnderDoctorIdParams = [
    (0, express_validator_1.query)("clinicCode").notEmpty(),
];
exports.validatSinglePatientUnderDoctorIdParams = [
    (0, express_validator_1.query)("clinicCode").notEmpty(),
    (0, express_validator_1.query)("patientId").notEmpty(),
];
exports.validateDoctorEmailParams = [
    (0, express_validator_1.body)("email").notEmpty(),
];
exports.validateDoctorPhoneNumberParams = [
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
];
exports.validatHmoIdParams = [
    (0, express_validator_1.query)("hmoId").notEmpty(),
];
exports.validateAdminSentOrderToHmoParams = [
    (0, express_validator_1.body)("patientId").notEmpty(),
    (0, express_validator_1.body)("hmoClinicCode").notEmpty(),
];
exports.validateAdminGettOrderToHmoParams = [
    (0, express_validator_1.query)("patientId").notEmpty(),
];
exports.validatepatientIdParams = [
    (0, express_validator_1.body)("patientId").notEmpty(),
];
const validateFormData = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};
exports.validateFormData = validateFormData;
