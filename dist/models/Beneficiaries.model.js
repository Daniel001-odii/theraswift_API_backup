"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BeneficiariesSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    beneficiaryUserId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
});
const Beneficiaries = (0, mongoose_1.model)('Beneficiaries', BeneficiariesSchema);
exports.default = Beneficiaries;
