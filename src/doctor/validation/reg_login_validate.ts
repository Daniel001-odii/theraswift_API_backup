import { body, query } from "express-validator";

export const validateDoctorSignupParams = [
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("password").notEmpty(),
  body("title").notEmpty(),
  //body("clinicCode").notEmpty(),
  body("organization")
    .isIn(["clinic", "hospital", "HMO"])
    .withMessage("Oganization must be either clinic, hospital or HMO"),
];

export const validateDoctorSendEmailParams = [
  body("email").isEmail(),
];

export const validateDoctorVerifiedEmailParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
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
export const validatePatientidperson = [
  body("patientId").notEmpty(),
];

export const validatePatientidQueryperson = [
  query("patientId").notEmpty(),
];

export const validateDeletePatientprescription = [
  body("patientId").notEmpty(),
  body("prescriptionId").notEmpty(),
];

export const validateEmail = [
  body("email").isEmail(),
];

export const validateResetPassword = [
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("password").notEmpty(),
];

export const validateSearchMedByName = [
  query("name").notEmpty(),
];

export const validateSearchMedByNameForm = [
  query("name").notEmpty(),
  query("form").notEmpty(),
];

export const validateSearchMedByNameFormDosage = [
  query("name").notEmpty(),
  query("form").notEmpty(),
  query("dosage").notEmpty(),
];

export const validateDrugPrescription = [
  body("patientId").notEmpty(),
  body("medicationId").notEmpty(),
  body("dosage").notEmpty(),
  body("frequency").notEmpty(),
  body("route").notEmpty(),
  body("duration").notEmpty(),
];

export const validatePatientPrescriptionidperson = [
  body("prescriptionId").notEmpty(),
];

export const validatePatientOderHmoperson = [
  body("patientId").notEmpty(),
  body("firstName").notEmpty(),
  body("surname").notEmpty(),
  body("phoneNumber").notEmpty(),
  body("EnroleNumber").notEmpty(),
  body("email").notEmpty(),
  body("address").notEmpty(),
  body("medicalCode").notEmpty(),
  body("medicalRecord").notEmpty(),
  body("hmoID").notEmpty(),
];


export const validateHmoActionOnPatientSignupParams = [ 
  body("hmoID").notEmpty(),
  body("status")
    .isIn(["approved", "denied"])
    .withMessage("status must be approved or denied"),
];