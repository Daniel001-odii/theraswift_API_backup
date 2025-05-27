"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFormidable = void 0;
// import * as formidable from "formidable";
const formidable_1 = __importDefault(require("formidable"));
// import formidable, { errors as formidableErrors } from "formidable";
const initializeFormidable = () => {
    const form = (0, formidable_1.default)({
        multiples: true,
    });
    return form;
};
exports.initializeFormidable = initializeFormidable;
