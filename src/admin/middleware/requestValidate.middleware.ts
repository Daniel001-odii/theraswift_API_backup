import { body, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

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
  body("phoneNumber").notEmpty(),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
  body("address").notEmpty(),
];

export const validateSendEmailigninParams = [
  body("email").isEmail(),
];

export const validateVerifyEmailEmailigninParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];


export const validateSendPhoneNumberParams = [
  body("mobileNumber").notEmpty(),
];

export const validateVerifyPhoneNumbweParams = [
  body("mobileNumber").notEmpty(),
  body("otp").notEmpty(),
];


export const validateAdminSigninParams = [
  body("email").isEmail(),
  body("password").notEmpty(),
];


export const validateAdminSigninPhonNumberParams = [
  body("mobileNumber").notEmpty(),
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

export const validatePhonNumber = [
  body("mobileNumber").notEmpty(),
];

export const validateResetPasswordByPhoneNumber = [
  body("mobileNumber").notEmpty(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const validateMedicationParams = [
  body("name").notEmpty(),
  body("price").isNumeric(),
  body("quantity").notEmpty(),
  body("form").notEmpty(),
  body("prescriptionRequired")
    .isIn(['required', 'not required', 'neccessary'])
    .withMessage("prescriptionRequired must be either required, not required or neccessary"),
  body("ingredient").notEmpty(),
  body("quantityForUser").notEmpty(),
  body("inventoryQuantity").notEmpty(),
  body("expiredDate").notEmpty(),
  body("category").notEmpty(),
  body("medInfo").notEmpty(),
];

export const validateMedicationEditParams = [
  body("medicationId").notEmpty(),
  body("name").notEmpty(),
  body("price").isNumeric(),
  body("quantity").notEmpty(),
  body("form").notEmpty(),
  body("prescriptionRequired")
    .isIn(['required', 'not required', 'neccessary'])
    .withMessage("prescriptionRequired must be either required, not required or neccessary"),
  body("ingredient").notEmpty(),
  body("quantityForUser").notEmpty(),
  body("inventoryQuantity").notEmpty(),
  body("expiredDate").notEmpty(),
  body("category").notEmpty(),
  body("medInfo").notEmpty(),
];

export const validateMedicationDeleteParams = [
  body("medicationId").notEmpty(),
];

export const validateUserParams = [
  query("userId").notEmpty(),
];

export const validateOrderParams = [
  query("orderId").notEmpty(),
];

export const validateOrderPostParams = [
  body("orderId").notEmpty(),
];

export const validatEssentialCategoryParams = [
  body("name").notEmpty(),
];

export const validateCategoryIDParams = [
  body("categoryId").notEmpty(),
];

export const validatEssentialProuctIdParams = [
  body("productId").notEmpty(),
];

export const validatEssentialProuctIdQueryarams = [
  query("productId").notEmpty(),
];

export const validatFrequenceAskParams = [
  body("question").notEmpty(),
  body("answer").notEmpty(),
];



//////////////////////
/// Doctor //////////
/////////////////

export const validatDoctorIdParams = [
  query("doctorId").notEmpty(),
];

export const validatPatientUnderDoctorIdParams = [
  query("clinicCode").notEmpty(),
];

export const validatSinglePatientUnderDoctorIdParams = [
  query("clinicCode").notEmpty(),
  query("patientId").notEmpty(),
];

export const validateDoctorEmailParams = [
  body("email").notEmpty(), 
];

export const validateDoctorPhoneNumberParams = [
  body("mobileNumber").notEmpty(), 
];

export const validatHmoIdParams = [
  query("hmoId").notEmpty(),
];

export const validateAdminSentOrderToHmoParams = [
  body("patientId").notEmpty(),
  body("hmoClinicCode").notEmpty(),
];

export const validateAdminGettOrderToHmoParams = [
  query("patientId").notEmpty(),
];


export const validateFormData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};






