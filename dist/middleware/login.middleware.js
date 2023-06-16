"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginParams = void 0;
const express_validator_1 = require("express-validator");
exports.validateLoginParams = [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
];
