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
exports.getDoctorInfoController = void 0;
const express_validator_1 = require("express-validator");
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const getDoctorInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId } = req.query; // Changed from req.body to req.query
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same ID...
        const doctor = yield doctor_reg_modal_1.default.findById(doctorId);
        // check if user exists
        if (!doctor) {
            return res
                .status(404)
                .json({ message: "Doctor not found" });
        }
        // get the super doctor...(doctor with thesame clinic code but with superDoctor as true)
        const super_doctor = yield doctor_reg_modal_1.default.findOne({ clinicCode: doctor === null || doctor === void 0 ? void 0 : doctor.clinicCode, superDoctor: true });
        return res.status(200).json({
            _id: doctor === null || doctor === void 0 ? void 0 : doctor._id,
            firstName: doctor === null || doctor === void 0 ? void 0 : doctor.firstName,
            lastName: doctor === null || doctor === void 0 ? void 0 : doctor.lastName,
            email: doctor === null || doctor === void 0 ? void 0 : doctor.email,
            organization: doctor === null || doctor === void 0 ? void 0 : doctor.organization,
            title: doctor === null || doctor === void 0 ? void 0 : doctor.title,
            addresss: doctor === null || doctor === void 0 ? void 0 : doctor.addresss,
            speciality: doctor === null || doctor === void 0 ? void 0 : doctor.speciality,
            regNumber: doctor === null || doctor === void 0 ? void 0 : doctor.regNumber,
            super_doctor,
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.getDoctorInfoController = getDoctorInfoController;
