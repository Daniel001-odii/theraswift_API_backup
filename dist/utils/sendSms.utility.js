"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms_old = exports.sendSms = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);
const sendSms = ({ to, sms }) => {
    client.messages.create({
        body: sms,
        from: twilioPhoneNumber,
        to: to,
    }).then((message) => console.log(message.sid));
};
exports.sendSms = sendSms;
const sendSms_old = ({ to, sms }) => {
    const data = {
        to,
        from: "N-Alert",
        sms,
        type: "plain",
        api_key: process.env.TERMI_API_KEY,
        channel: "dnd",
    };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    (0, node_fetch_1.default)("https://v3.api.termii.com/api/sms/send", options)
        .then((response) => {
        console.log("response from sent message ", response);
    })
        .catch((error) => {
        console.error(error);
        throw error;
    });
};
exports.sendSms_old = sendSms_old;
