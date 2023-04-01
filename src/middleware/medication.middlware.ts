import { body, validationResult } from "express-validator";

// Define validation rules using for medication
export const validateMedication = [
  body("name").notEmpty(),
  body("description").notEmpty(),
  body("dosage").notEmpty(),
  body("manufacturer").notEmpty(),
  body("price").notEmpty().isNumeric(),
  body("expiryDate").notEmpty().isISO8601().toDate(),
  body("routeOfAdministration").notEmpty(),
];