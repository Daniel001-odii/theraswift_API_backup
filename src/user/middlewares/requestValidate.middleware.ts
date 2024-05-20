import { body, query } from "express-validator";

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

export const validateRemovedMedicationParams = [
  body("userMedicationId").notEmpty(),
  body("reason").notEmpty(),
];


export const validateUserAddMedicationParams = [
  body("medicationId").notEmpty(),
];


export const validateSearchMedicationByNameParams = [
  query("name").notEmpty(),
];

export const validateGetMedicationByIdParams = [
  query("meidcationId").notEmpty(),
];

export const validateSearchMedicationByNameFRomParams = [
  query("name").notEmpty(),
  query("form").notEmpty(),
];


export const validateSearchMedicationByNameFRomDosageParams = [
  query("name").notEmpty(),
  query("form").notEmpty(),
  query("dosage").notEmpty(),
];

export const validateUserCartParams = [
  body("cartId").notEmpty(),
];

export const validateUserCartQueryParams = [
  query("cartId").notEmpty(),
];

export const validateUserCheckOutParams = [
  body("deliveryDate").notEmpty(),
  body("firstName").notEmpty(),
  body("dateOfBirth").notEmpty(),
  body("address").notEmpty(),
  body("lastName").notEmpty(),
  body("gender")
  .isIn(["male", "female"]),
  body("others").isArray().custom((value: any[]) => {
    // Check if the 'others' field is an array
    if (!Array.isArray(value)) {
      throw new Error('Invalid format for the "others" field.');
    }
    return true;
  }),
];

export const validateUserCheckOutDirectParams = [
  body("deliveryDate").notEmpty(),
  body("firstName").notEmpty(),
  body("dateOfBirth").notEmpty(),
  body("address").notEmpty(),
  body("lastName").notEmpty(),
  body("gender")
  .isIn(["male", "female"]),
  body("others").isArray().custom((value: any[]) => {
    // Check if the 'others' field is an array
    if (!Array.isArray(value)) {
      throw new Error('Invalid format for the "others" field.');
    }
    return true;
  }),
  body("medicationId").notEmpty(),
  body("type")
  .isIn(["med", "ess"]),
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
  body("doorMan")
  .isIn([true, false])
  .withMessage("doorMan must be either true or false"),
  body("handDeliver")
  .isIn([true, false])
  .withMessage("handDeliver must be either true or false"),
  body("state").notEmpty(),
];


export const validateDeliveryStateParams = [
  body("address").notEmpty(),
  body("state")
  .isIn(["Lagos", "Ogun"])
  .withMessage("delivery state available are Lagos and Ogun"),
];

export const validateEnssntialProoudtParams = [
  query("categoryId").notEmpty(),
];

export const validateEnssntialCarttParams = [
  body("productId").notEmpty(),
];

export const validateEnssntialcartIDtParams = [
  body("enssentialCartId").notEmpty(),
];