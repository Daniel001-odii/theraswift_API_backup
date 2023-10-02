import { body } from "express-validator";

export const validateSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("dateOfBirth").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("mobileNumber").notEmpty(),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
];

export const validateEmailParams = [
  body("email").isEmail(),
];


export const validatePhoneNumberParams = [
  body("mobileNumber").notEmpty(),
];
export const validateEmailVerificatioParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];

export const validatePhoneNumberVerificatioParams = [
  body("mobileNumber").notEmpty(),
  body("otp").notEmpty(),
];

export const validateEmailResetPasswordParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const validatePhoneNumberResetPasswordParams = [
  body("mobileNumber").notEmpty(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const validateEmailLoginParams = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

export const validatePhoneLoginParams = [
  body("mobileNumber").notEmpty(),
  body("password").notEmpty(),
];


export const validateAddMedicationParams = [
  body("userMedicationId").notEmpty(),
];


export const validateUserAddMedicationParams = [
  body("medicationId").notEmpty(),
];


export const validateSearchMedicationByNameParams = [
  body("name").notEmpty(),
];

export const validateSearchMedicationByNameFRomParams = [
  body("name").notEmpty(),
  body("form").notEmpty(),
];


export const validateSearchMedicationByNameFRomDosageParams = [
  body("name").notEmpty(),
  body("form").notEmpty(),
  body("dosage").notEmpty(),
];

export const validateUserCartParams = [
  body("cartId").notEmpty(),
];