"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * validates mongoose id
 * @param {string} id
 */
const isValidId = (id) => id && mongoose_1.default.Types.ObjectId.isValid(id);
exports.isValidId = isValidId;
