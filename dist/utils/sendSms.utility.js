"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const sendSms = ({ to, sms }) => {
    const data = {
        to,
        from: "THERASWIFT",
        sms,
        type: "plain",
        api_key: process.env.TERMI_API_KEY,
        channel: "generic",
    };
    console.log(to);
    console.log(sms);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    (0, node_fetch_1.default)("https://api.ng.termii.com/api/sms/send", options)
        .then((response) => {
        console.log("sent message ", response.body);
    })
        .catch((error) => {
        console.error(error);
        throw error;
    });
};
exports.sendSms = sendSms;
