"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMedication = void 0;
const express_validator_1 = require("express-validator");
// Define validation rules using for medication
exports.validateMedication = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("description").notEmpty(),
    (0, express_validator_1.body)("strength").notEmpty(),
    (0, express_validator_1.body)("manufacturer").notEmpty(),
    (0, express_validator_1.body)("price").notEmpty().isNumeric(),
    (0, express_validator_1.body)("expiryDate").notEmpty().isISO8601().toDate(),
    (0, express_validator_1.body)("routeOfAdministration").notEmpty(),
    (0, express_validator_1.body)("category").notEmpty(),
];
