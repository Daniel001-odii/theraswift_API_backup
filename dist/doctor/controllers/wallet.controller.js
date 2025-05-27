"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.withdrawFunds = exports.initiatePayoutReference = exports.confirmFundPayoutDetails = exports.getAllBanks = exports.setFundsWithdrawalDetails = exports.setWalletClinicCode = exports.getDoctorWallet = exports.fundDoctorWallet = void 0;
const doctorWallet_model_1 = __importDefault(require("../modal/doctorWallet.model"));
const https = __importStar(require("https"));
const crypto = __importStar(require("crypto"));
const banks_json_1 = __importDefault(require("../../utils/banks.json"));
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
// FUND DOCTOR WALLET >>>
const fundDoctorWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.doctor;
        const { amount } = req.body;
        const wallet = yield doctorWallet_model_1.default.findOne({ doctorId: doctor_id });
        // algorithim to fund doctor wallet here...
        if (!amount) {
            return res.status(400).json({ message: "please provide a valid amount" });
        }
        // add amount to doctor's wallet here...
        wallet.amount += amount;
        // add transaction type for history tracking...
        wallet.transactions.push({
            transaction_type: "fund",
            // transsaction_date is prefilled by default
        });
        res.status(201).json({ message: `you added ${amount} into your wallet` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.fundDoctorWallet = fundDoctorWallet;
// GET DOCTOR WALLET >>>
const getDoctorWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.doctor._id;
        const wallet = yield doctorWallet_model_1.default.findOne({ doctorId: doctor_id });
        if (!wallet) {
            const newWallet = new doctorWallet_model_1.default({
                doctorId: doctor_id
            });
            yield newWallet.save();
            return res.status(201).json({ message: "new wallet created for doctor", newWallet });
        }
        res.status(200).json({ wallet });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDoctorWallet = getDoctorWallet;
// SET WALLET CLINIC CODE >>>
const setWalletClinicCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.doctor._id;
        const { clinicCode } = req.body;
        const wallet = yield doctorWallet_model_1.default.findOne({ doctorId: doctor_id });
        if (!clinicCode) {
            return res.status(400).json({ message: "please provide a valid clinic code" });
        }
        wallet.clinicCode = clinicCode;
        yield wallet.save();
        res.status(200).json({ message: "wallet clinic code updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.setWalletClinicCode = setWalletClinicCode;
// Set withdrawl details, this is essentially required for paystack required
const setFundsWithdrawalDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.doctor._id;
        const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
        const { account_number, bank_code } = req.body;
        if (!account_number || !bank_code) {
            return res.status(400).json({ message: "missing required field in body" });
        }
        const wallet = yield doctorWallet_model_1.default.findOne({ doctorId: doctor_id });
        wallet.funds_payout.account_number = account_number;
        wallet.funds_payout.bank_code = bank_code;
        yield wallet.save();
        // set doctor completedAccountSteps...
        doctor.completedAccountSteps.step2.addedPaymentMethod = true;
        yield doctor.save();
        const saved_ref = yield (0, exports.initiatePayoutReference)(req, res);
        if (saved_ref) {
            return res.status(201).json({ message: "payment details updated successfully!" });
        }
        else {
            console.log("ref code error: ", saved_ref);
            return res.status(400).json({ message: "error setting ref_code!" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "error updating payment details" });
        console.log("error updating payment method?: ", error);
    }
});
exports.setFundsWithdrawalDetails = setFundsWithdrawalDetails;
/*
c
*/
// get bank details to enable setting details...
const getAllBanks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banks_list = banks_json_1.default;
        res.status(200).json({ banks_list });
    }
    catch (error) {
        console.log("error getting banks: ", error);
    }
});
exports.getAllBanks = getAllBanks;
// confirm account details...
const confirmFundPayoutDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_number, bank_code } = req.body;
    if (!account_number || !bank_code) {
        res.status(400).json({ error: 'Account number and bank code are required' });
        return;
    }
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_KEY}`
        }
    };
    try {
        const bankDetails = yield new Promise((resolve, reject) => {
            const req = https.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (error) {
                        reject(new Error('Error parsing response from Paystack API'));
                    }
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.end();
        });
        res.status(200).json({ success: true, data: bankDetails });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Unable to fetch bank details' });
    }
});
exports.confirmFundPayoutDetails = confirmFundPayoutDetails;
// 
const initiatePayoutReference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor_id = req.doctor._id;
    const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
    const wallet = yield doctorWallet_model_1.default.findOne({ doctorId: doctor_id });
    const name = `${doctor === null || doctor === void 0 ? void 0 : doctor.firstName} ${doctor === null || doctor === void 0 ? void 0 : doctor.lastName}`;
    const account_number = wallet.funds_payout.account_number;
    const bank_code = wallet.funds_payout.bank_code;
    // const { name, account_number, bank_code } = req.body;
    const type = "nuban";
    const currency = "NGN";
    if (!type || !name || !account_number || !bank_code || !currency) {
        res.status(400).json({ error: 'All fields are required: type, name, account_number, bank_code, and currency.' });
        return;
    }
    const params = JSON.stringify({
        type,
        name,
        account_number,
        bank_code,
        currency
    });
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transferrecipient',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = yield new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (error) {
                        reject(new Error('Error parsing response from Paystack API'));
                    }
                });
            });
            request.on('error', (error) => {
                reject(error);
            });
            request.write(params);
            request.end();
        });
        //   res.status(200).json({ success: true, data: result });
        const recipient_code = result.data.recipient_code;
        wallet.funds_payout.recipient_code = recipient_code;
        yield wallet.save();
        console.log("generated ref code: ", recipient_code);
        return recipient_code;
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, error: 'Unable to create transfer recipient' });
    }
});
exports.initiatePayoutReference = initiatePayoutReference;
/*
     "source": "balance",
  "amount": 37800,
  "reference": "your-unique-reference",
  "recipient": "RCP_t0ya41mp35flk40",
  "reason": "Holiday Flexing"
*/
// withdraw funds to account...
const withdrawFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor_id = req.doctor._id;
    const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
    const wallet = yield doctorWallet_model_1.default.findOne({ doctorId: doctor_id });
    // Generate a unique reference code..
    const reference = crypto.randomBytes(8).toString('hex');
    const source = "balance";
    const recipient = wallet.funds_payout.recipient_code;
    const reason = "Theraswift doctor incentive payout";
    // const { amount } = req.body;
    const amount = "25000";
    // Validate input
    if (!source || !amount || !reference || !recipient || !reason) {
        res.status(400).json({
            error: 'All fields are required: source, amount, reference, recipient, and reason.'
        });
        return;
    }
    const params = JSON.stringify({
        source,
        amount,
        reference,
        recipient,
        reason
    });
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transfer',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = yield new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (error) {
                        reject(new Error('Error parsing response from Paystack API'));
                    }
                });
            });
            request.on('error', (error) => {
                reject(error);
            });
            request.write(params);
            request.end();
        });
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to initiate transfer'
        });
    }
});
exports.withdrawFunds = withdrawFunds;
