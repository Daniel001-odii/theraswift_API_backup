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
  body("operatingLocation")
  .isIn(["Lagos", "Ogun"])
  .withMessage("operating location must be either Lagos or Ogun"),
  body("address").notEmpty(),
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

export const validateUserCheckOutParams = [
  body("deliveryDate").notEmpty(),
  body("firstName").notEmpty(),
  body("dateOfBirth").notEmpty(),
  body("address").notEmpty(),
  body("lastName").notEmpty(),
  body("gender")
  .isIn(["male", "female"])
];

export const validateUserCheckOutVerificationParams = [
  body("reference").notEmpty(),
  body("orderId").notEmpty(),
];

export const validatefamilymemberParams = [
  body("firstName").notEmpty(),
  body("dateOfBirth").notEmpty(),
  body("lastName").notEmpty(),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
];

export const validateAddressParams = [
  body("streetAddress").notEmpty(),
  body("streetNO").notEmpty(),
  body("LGA").notEmpty(),
  body("DeliveryInstruction").notEmpty(),
];


export const validateDeliveryStateParams = [
  body("address").notEmpty(),
  body("state")
  .isIn(["Lagos", "Ogun"])
  .withMessage("delivery state available are Lagos and Ogun"),
];

export const validateEnssntialProoudtParams = [
  body("categoryId").notEmpty(),
];

export const validateEnssntialCarttParams = [
  body("productId").notEmpty(),
];

export const validateEnssntialcartIDtParams = [
  body("enssentialCartId").notEmpty(),
];