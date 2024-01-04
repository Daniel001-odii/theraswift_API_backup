"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminNewsletterSubcriberController = exports.adminFrequenceAskController = void 0;
const express_validator_1 = require("express-validator");
const frequenceAskQuestion_model_1 = __importDefault(require("../models/frequenceAskQuestion.model"));
const newsletter_model_1 = __importDefault(require("../../user/models/newsletter.model"));
// add frequence question ans ansawer
const adminFrequenceAskController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newFreuenceAsk = new frequenceAskQuestion_model_1.default({
            question,
            answer
        });
        newFreuenceAsk.save();
        return res.status(200).json({ message: "frequency question and answe successfully added" });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminFrequenceAskController = adminFrequenceAskController;
// get all the newsletter scriber
const adminNewsletterSubcriberController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newsletterScriber = yield newsletter_model_1.default.find();
        return res.status(200).json({
            newsletterScriber
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.adminNewsletterSubcriberController = adminNewsletterSubcriberController;
