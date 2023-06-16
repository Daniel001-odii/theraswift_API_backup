"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignupParams = void 0;
const express_validator_1 = require("express-validator");
exports.validateSignupParams = [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("dateOfBirth").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("password").notEmpty(),
    // body("passwordConfirmation").custom((value, { req }) => {
    //   if (value !== req.body.password) {
    //     throw new Error("Passwords do not match");
    //   }
    //   return true;
    // }),
    (0, express_validator_1.body)("mobileNumber").notEmpty(),
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female"])
        .withMessage("Gender must be either male or female"),
];
