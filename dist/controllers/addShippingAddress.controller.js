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
exports.getUserShippingAddressByIdController = exports.getUserShippingAddressController = exports.addShippingAddressController = void 0;
const ShippingAddress_model_1 = __importDefault(require("../models/ShippingAddress.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const addShippingAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, street_address, street_number, delivery_instruction, leave_with_doorman, lga, } = req.body;
        // check if needed parameters are sent in the body
        if (!street_address || !userId || !street_number)
            return res
                .status(400)
                .json({ message: "please send required body queries" });
        // Check if the user exists in the database
        const existingUser = yield User_model_1.default.findOne({ userId });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists" });
        }
        let newShippingAddress = {};
        newShippingAddress = new ShippingAddress_model_1.default({
            userId,
            street_address,
            street_number,
            delivery_instruction,
            leave_with_doorman,
            lga,
        });
        let newShippingAddressResp = yield newShippingAddress.save();
        return res.json({ message: "Shipping address created successfully", address_added: newShippingAddressResp });
    }
    catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.addShippingAddressController = addShippingAddressController;
const getUserShippingAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.body;
    try {
        let data = yield ShippingAddress_model_1.default.find({ userId });
        res.status(200).json({ user_address: data, message: "Shipping address retrieved successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
        // throw Error(error)
    }
});
exports.getUserShippingAddressController = getUserShippingAddressController;
const getUserShippingAddressByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { address_id } = req.body;
    try {
        let data = yield ShippingAddress_model_1.default.findById(address_id);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
        // throw Error(error)
    }
});
exports.getUserShippingAddressByIdController = getUserShippingAddressByIdController;
