import { body } from "express-validator";

export const validateDoctorSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
  body("title").notEmpty(),
  body("organization")
    .isIn(["clinic", "hospital", "HMO"])
    .withMessage("Oganization must be either clinic, hospital or HMO"),
];

export const validateDoctorSigninParams = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

export const validatePatientRegParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("surname").notEmpty(),
  body("phoneNumber").notEmpty(),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  body("address").notEmpty(),
  body("dateOFBirth").notEmpty(),
];

export const validatePatientid = [
  body("id").notEmpty(),
];

export const validateEmail = [
  body("email").isEmail(),
];

export const validateResetPassword = [
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];