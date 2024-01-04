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
exports.frequenceAskQuestionController = exports.subcribForNewsletterController = void 0;
const express_validator_1 = require("express-validator");
const newsletter_model_1 = __importDefault(require("../models/newsletter.model"));
const frequenceAskQuestion_model_1 = __importDefault(require("../../admin/models/frequenceAskQuestion.model"));
//subscrib for newsletter /////////////
const subcribForNewsletterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkEmail = yield newsletter_model_1.default.findOne({ email });
        if (checkEmail) {
            return res
                .status(401)
                .json({ message: "email already added to newsletter" });
        }
        const newScriber = new newsletter_model_1.default({ email });
        yield newScriber.save();
        return res.status(200).json({
            message: "email succefully added to newsletter",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.subcribForNewsletterController = subcribForNewsletterController;
//get frequncy question and answe /////////////
const frequenceAskQuestionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const FrequenceQuestionAnwer = yield frequenceAskQuestion_model_1.default.find();
        return res.status(200).json({
            FrequenceQuestionAnwer,
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.frequenceAskQuestionController = frequenceAskQuestionController;
