import { body, query } from "express-validator";

export const validateSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
  // body("passwordConfirmation").custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new Error("Passwords do not match");
  //   }
  //   return true;
  // }),
  body("phoneNumber").notEmpty(),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
  body("city").notEmpty(),
  body("licensePlate").notEmpty(),
];

export const validateSendEmailParams = [
  body("email").isEmail(),
];

export const validateVerifyEmailParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];

export const validateSendPhoneNumberParams = [
  body("mobileNumber").notEmpty(),
];

export const validateVerifyPhoneNumberParams = [
  body("mobileNumber").notEmpty(),
  body("otp").notEmpty(),
];

export const validateEmailSignInParams = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

export const validatePhoneNumberSignInParams = [
  body("mobileNumber").notEmpty(),
  body("password").notEmpty(),
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

export const validateDriverInitiateDeliveryParams = [
  body("enoughFuel")
    .isIn(["yes", "no"])
    .withMessage("enoughFuel must be either yes or no"),
  body("phoneCharge")
  .isIn(["yes", "no"])
  .withMessage("phoneCharge must be either yes or no"),
  body("theraswitId")
    .isIn(["yes", "no"])
    .withMessage("theraswitId must be either yes or no"),
];

export const validateDriverPickUpDeliveryGoodsParams = [
  body("userId").notEmpty(),
  body("orderId").notEmpty(),
  body("deliveryId").notEmpty(),
];

export const validateDeliveryIdParams = [
  body("deliveryId").notEmpty(),
];