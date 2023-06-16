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
exports.sendOrderCompleteEmail = exports.sendOrderStatusEmail = exports.sendPasswordRecoveryEmail = exports.sendTopUpEmail = exports.sendGiftTopUpRecipientEmail = exports.sendGiftTopUpSenderEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailTemplate_1 = require("../templates/mailTemplate");
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
            html: (0, mailTemplate_1.htmlMailTemplate)(otp, firstName),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendEmail = sendEmail;
const sendGiftTopUpSenderEmail = ({ amount, recipientId, recipientName, emailTo, subject, senderName, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, mailTemplate_1.senderEmailTemplate)(amount, recipientId, recipientName, senderName),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendGiftTopUpSenderEmail = sendGiftTopUpSenderEmail;
const sendGiftTopUpRecipientEmail = ({ amount, senderId, recipientId, senderName, emailTo, subject, recipientName, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, mailTemplate_1.receiverEmailTemplate)(amount, senderId, senderName, recipientId, recipientName),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendGiftTopUpRecipientEmail = sendGiftTopUpRecipientEmail;
const sendTopUpEmail = ({ amount, referenceId, emailTo, subject, name, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, mailTemplate_1.walletTopupEmailTemplate)(name, amount, referenceId),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendTopUpEmail = sendTopUpEmail;
const sendPasswordRecoveryEmail = ({ emailTo, subject, otp, firstName, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, mailTemplate_1.passwordRecoveryMailTemplate)(otp, firstName),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendPasswordRecoveryEmail = sendPasswordRecoveryEmail;
const sendOrderStatusEmail = ({ emailTo, subject, orderStatus, firstName, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, mailTemplate_1.orderStatusTemplate)(firstName, orderStatus),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendOrderStatusEmail = sendOrderStatusEmail;
const sendOrderCompleteEmail = ({ emailTo, subject, deliveryDate, orderId, }) => __awaiter(void 0, void 0, void 0, function* () {
    // Init the nodemailer transporter
    transporterInit();
    try {
        let response = yield transporter.sendMail({
            from: "Theraswift",
            to: emailTo,
            subject: subject,
            html: (0, mailTemplate_1.orderCompleteEmailTemplate)(orderId, deliveryDate),
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.sendOrderCompleteEmail = sendOrderCompleteEmail;
