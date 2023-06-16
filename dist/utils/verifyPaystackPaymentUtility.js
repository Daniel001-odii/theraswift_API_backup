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
exports.verifyPaystackPayment = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const verifyPaystackPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: `/transaction/verify/:${reference}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
        },
    };
    try {
        const res = yield (0, node_fetch_1.default)(`https://${options.hostname}${options.path}`, {
            method: options.method,
            headers: options.headers,
        });
        const data = yield res.json();
        if (data.status == false) {
            throw Error(data.message);
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.verifyPaystackPayment = verifyPaystackPayment;
