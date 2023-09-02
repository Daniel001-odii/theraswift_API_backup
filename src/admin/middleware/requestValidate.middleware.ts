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