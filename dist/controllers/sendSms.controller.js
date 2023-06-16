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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsController = void 0;
const sendSmsUtility_1 = require("../utils/sendSmsUtility");
const sendSmsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { smsInformation, mobileNumber } = req.body;
        let data = { to: mobileNumber, sms: smsInformation };
        (0, sendSmsUtility_1.sendSms)(data);
    }
    catch (err) {
        res.send(400).json({ error: err.message });
    }
});
exports.sendSmsController = sendSmsController;
