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
exports.deleteUserHMOByIdController = exports.getUserHMOsController = exports.getAllHMOController = exports.getHMOByIdController = exports.addHmoController = void 0;
const HMO_model_1 = __importDefault(require("../models/HMO.model"));
const awsS3_1 = require("../utils/awsS3");
const uuid_1 = require("uuid");
const addHmoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { back_insurance_image = false, front_insurance_image = false, userId, hmo_name, } = req.body;
        if (!userId)
            return res.json({ message: "user ID is not found" });
        let insurance_image_url = "";
        if (req.file) {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, awsS3_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            insurance_image_url = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
        }
        const newHMO = new HMO_model_1.default({
            userId,
            HmoName: hmo_name,
            back_insurance_image: back_insurance_image && insurance_image_url,
            false_insurance_image: front_insurance_image && insurance_image_url,
        });
        let savedHMO = yield newHMO.save();
        res.status(201).json({
            message: "HMO added successfully",
            hmo_member: savedHMO,
        });
    }
    catch (err) {
        // throw err.message;
        res.status(500).json({ error: err.message });
    }
});
exports.addHmoController = addHmoController;
const getHMOByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { hmo_id } = req.body;
    try {
        let data = yield HMO_model_1.default.findById(hmo_id);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
        // throw Error(error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getHMOByIdController = getHMOByIdController;
const getAllHMOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield HMO_model_1.default.find();
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
        // throw Error(error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getAllHMOController = getAllHMOController;
const getUserHMOsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.body;
    try {
        let data = yield HMO_model_1.default.find({ userId });
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
        // throw Error(error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getUserHMOsController = getUserHMOsController;
const deleteUserHMOByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { hmo_id } = req.body;
    try {
        let data = yield HMO_model_1.default.findByIdAndDelete(hmo_id);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
        // throw Error(error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUserHMOByIdController = deleteUserHMOByIdController;
