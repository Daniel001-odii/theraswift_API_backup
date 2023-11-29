import { body } from "express-validator";

export const validateAdminSigninParams = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

export const validateEmail = [
  body("email").isEmail(),
];

export const validateResetPassword = [
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const validateMedicationParams = [
  body("name").notEmpty(),
  body("manufacturer").notEmpty(),
  body("price").notEmpty(),
  body("strength").notEmpty(),
  body("quantity").notEmpty(),
  body("prescriptionRequired")
    .isIn([true, false])
    .withMessage("prescriptionRequired must be either true or false"),
  body("medInfo").notEmpty(),
];

export const validateMedicationEditParams = [
  body("medicationId").notEmpty(),
  body("name").notEmpty(),
  body("price").notEmpty(),
  body("strength").notEmpty(),
  body("quantity").notEmpty(),
  body("prescriptionRequired")
    .isIn([true, false])
    .withMessage("prescriptionRequired must be either true or false"),
  body("form").notEmpty(),
  body("ingredient").notEmpty(),
  body("medInfo").notEmpty(),
];

export const validateMedicationDeleteParams = [
  body("medicationId").notEmpty(),
];

export const validateUserParams = [
  body("userId").notEmpty(),
];

export const validateOrderParams = [
  body("orderId").notEmpty(),
];

export const validatEssentialCategoryParams = [
  body("name").notEmpty(),
];



