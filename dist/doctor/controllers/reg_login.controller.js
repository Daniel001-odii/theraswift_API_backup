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
exports.doctorRegisterPatient = exports.doctorSignInController = exports.doctorSignUpController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
//doctor signup /////////////
const doctorSignUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, password, title, organization, clinicCode, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const doctorEmailExists = yield doctor_reg_modal_1.default.findOne({ email });
        // check if doctor exists
        if (doctorEmailExists) {
            return res
                .status(401)
                .json({ message: "Email  exists already" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        let doctorClinicCode = '';
        if (clinicCode != '') {
            doctorClinicCode = clinicCode;
        }
        // Save user to MongoDB
        const doctor = new doctor_reg_modal_1.default({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            title,
            organization,
            clinicCode: doctorClinicCode
        });
        let doctorSaved = yield doctor.save();
        // //create doctor wallet Account
        // const doctorWallet = new DoctorWalletModel({
        //   amount: 0,
        //   doctorId: doctorSaved._id
        // })
        // await doctorWallet.save();
        res.json({
            message: "Signup successful",
            doctor: {
                _id: doctorSaved._id,
                firstName: doctorSaved.firstName,
                lastName: doctorSaved.lastName,
                email: doctorSaved.email,
                organization: doctorSaved.organization,
                title: doctorSaved.title
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSignUpController = doctorSignUpController;
//doctor signIn /////////////
const doctorSignInController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find doctor with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ email });
        // check if doctor exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "incorrect credential" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, doctor.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: doctor === null || doctor === void 0 ? void 0 : doctor._id,
            email: doctor.email,
            clinicCode: doctor.clinicCode
        }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
        // return access token
        res.json({
            message: "Login successful",
            Token: accessToken
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSignInController = doctorSignInController;
//doctor register patient /////////////
const doctorRegisterPatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Access the uploaded file details
        const file = req.file;
        let medicationImg;
        const { email, firstName, surname, phoneNumber, gender, address, dateOFBirth, hmo, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!file) {
            medicationImg = '';
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            medicationImg = result === null || result === void 0 ? void 0 : result.Location;
            console.log(result);
            //medicationImg = uploadToS3(file);
        }
        const doctor = req.doctor;
        let patientHmo = '';
        if (hmo != '') {
            patientHmo = hmo;
        }
        // Save patient to MongoDB
        const patient = new patient_reg_model_1.default({
            email,
            firstName,
            surname,
            phoneNumber,
            gender,
            address,
            dateOFBirth,
            medicalRecord: medicationImg,
            doctorId: doctor._id,
            hmo: patientHmo,
        });
        let patientSaved = yield patient.save();
        return res.status(200).json({
            message: "Login successful",
            patient: {
                id: patientSaved._id,
                email: patientSaved.email,
                firstName: patient.firstName,
                surname: patientSaved.surname,
                phoneNumber: patientSaved.phoneNumber,
                gender: patientSaved.gender,
                address: patientSaved.address,
                dateOFBirth: patientSaved.dateOFBirth,
                doctorId: patientSaved.doctorId,
                medecalRecord: medicationImg
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorRegisterPatient = doctorRegisterPatient;
