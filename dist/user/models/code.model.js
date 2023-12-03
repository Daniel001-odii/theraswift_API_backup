"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CodeSchema = new mongoose_1.Schema({
    code: {
        type: Number,
        default: 100000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const CodeModel = (0, mongoose_1.model)("RefererCodeGenerator", CodeSchema);
exports.default = CodeModel;
