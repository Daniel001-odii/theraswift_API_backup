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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        const formattedAddress = {
            streetAddress: newShippingAddressResp.street_address,
            streetNo: newShippingAddressResp.street_number,
            LGA: newShippingAddressResp.lga,
            deliveryInstruction: newShippingAddressResp.delivery_instruction,
            LeaveWithDoorMan: newShippingAddressResp.leave_with_doorman,
        };
        return res.status(201).json({
            message: "Shipping address created successfully",
            address_added: formattedAddress,
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err.message, message: "internal server error" });
        console.log(err.message);
    }
});
exports.addShippingAddressController = addShippingAddressController;
const getUserShippingAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let secret = process.env.JWT_SECRET_KEY;
        // Get JWT from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        const { userId } = jsonwebtoken_1.default.verify(token, secret);
        let data = yield ShippingAddress_model_1.default.find({ userId });
        if (!data || data.length === 0) {
            return res.status(200).json({
                user_address: [],
                message: "No shipping address found",
            });
        }
        const formattedData = data.map((address) => ({
            streetAddress: address.street_address,
            streetNo: address.street_number,
            LGA: address.lga,
            deliveryInstruction: address.delivery_instruction,
            LeaveWithDoorMan: address.leave_with_doorman,
        }));
        res.status(200).json({
            user_address: formattedData,
            message: "Shipping addresses retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserShippingAddressController = getUserShippingAddressController;
const getUserShippingAddressByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { address_id } = req.params;
    try {
        let data = yield ShippingAddress_model_1.default.findById(address_id);
        if (!data)
            return res.status(404).json({ message: "Address not found" });
        const formattedAddress = {
            streetAddress: data.street_address,
            streetNo: data.street_number,
            LGA: data.lga,
            deliveryInstruction: data.delivery_instruction,
            LeaveWithDoorMan: data.leave_with_doorman,
        };
        res.status(200).json({ user_address: formattedAddress });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserShippingAddressByIdController = getUserShippingAddressByIdController;
