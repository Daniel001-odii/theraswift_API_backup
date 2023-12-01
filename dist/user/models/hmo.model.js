"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HmoSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'UserReg',
        required: true,
    },
    hmoImage: {
        type: String,
        default: "",
    },
    enrolNumber: {
        type: String,
        default: "",
    },
    enrolName: {
        type: String,
        default: "",
    },
    provider: {
        type: String,
        default: "",
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
const UserHmoModel = (0, mongoose_1.model)("UserHmo", HmoSchema);
exports.default = UserHmoModel;
