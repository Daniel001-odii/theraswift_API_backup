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
exports.getUserDispenseLogs = exports.getDispenseLogs = exports.getDispenseLogById = exports.saveDispenseLog = void 0;
const DispenseLog_model_1 = __importDefault(require("../models/DispenseLog.model"));
const saveDispenseLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, prescriber, dispenser, dateOfBirth, dateDispensed, dosage, orderId, userId, } = req.body;
        // Validate the request body
        if (!fullName || !email || !prescriber || !dispenser) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        // Create a new Dispense log document
        let newDispenseLog;
        newDispenseLog = new DispenseLog_model_1.default({
            fullName,
            email,
            prescriber,
            dispenser,
            dateOfBirth,
            dateDispensed,
            dosage,
            orderId,
            userId,
        });
        let dispenseLog = yield newDispenseLog.save();
        // Return the new dispense log document
        res
            .status(201)
            .json({ message: "dispense log saved successfully", dispenseLog });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.saveDispenseLog = saveDispenseLog;
const getDispenseLogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        let data = yield DispenseLog_model_1.default.findById(id);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getDispenseLogById = getDispenseLogById;
const getDispenseLogs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dispenseLogs = yield DispenseLog_model_1.default.find();
            res.status(200).json({ data: dispenseLogs });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
exports.getDispenseLogs = getDispenseLogs;
const getUserDispenseLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userId } = req.params;
        const userOrders = yield DispenseLog_model_1.default.find({ userId });
        res.status(200).json({
            user_orders: userOrders,
            message: "User Dispense logs retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUserDispenseLogs = getUserDispenseLogs;
