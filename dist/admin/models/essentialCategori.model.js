"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EssentialCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    img: {
        type: String,
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
const EssentialCategoryModel = (0, mongoose_1.model)("EssentialCategory", EssentialCategorySchema);
exports.default = EssentialCategoryModel;
