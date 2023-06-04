import { body } from "express-validator";

export const validateSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("dateOfBirth").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
  // body("passwordConfirmation").custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new Error("Passwords do not match");
  //   }
  //   return true;
  // }),
  body("mobileNumber").notEmpty(),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
];
