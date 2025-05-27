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
exports.editUserprofile = void 0;
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const express_validator_1 = require("express-validator");
const editUserprofile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // const user = req.user;
        const userId = req.user.id;
        const user = yield userReg_model_1.default.findById(userId);
        const { firstName, lastName, dateOfBirth, mobileNumber, gender, operatingLocation, address } = req.body;
        // update firstname...
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
        }
        if (mobileNumber) {
            user.mobileNumber = mobileNumber;
        }
        if (gender) {
            user.gender = gender;
        }
        if (operatingLocation) {
            user.operatingLocation = operatingLocation;
        }
        if (address) {
            user.address = address;
        }
        yield user.save();
        res.status(200).json({ message: "user profile updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.editUserprofile = editUserprofile;
