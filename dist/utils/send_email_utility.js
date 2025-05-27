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
exports.sendAccountDeleteEmail = exports.sendUserAccountVerificationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmailTemplate_1 = require("../templates/sendEmailTemplate");
const accountDeleteTemp_1 = require("../templates/accountDeleteTemp");
const userAccountVerifyTemplate_1 = require("../templates/userAccountVerifyTemplate");
let transporter;
const transporterInit = () => {
    // Define the nodemailer transporter
    transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        secureConnection: false,
        port: 465,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: true,
        },
    });
};
const sendEmail = ({ emailTo, subject, otp, firstName, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, sendEmailTemplate_1.htmlMailTemplate)(otp, firstName),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendEmail = sendEmail;
const sendUserAccountVerificationEmail = ({ emailTo, subject, otp, firstName, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, userAccountVerifyTemplate_1.accountVerifyTemplate)(otp, firstName),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendUserAccountVerificationEmail = sendUserAccountVerificationEmail;
const sendAccountDeleteEmail = ({ emailTo, subject, otp, firstName, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, accountDeleteTemp_1.accountDeleteEmailTemplate)(otp, firstName),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendAccountDeleteEmail = sendAccountDeleteEmail;
