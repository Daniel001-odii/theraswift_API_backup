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
exports.getDetailsThroughDecodedToken = exports.uploadHMOImagesToFirebase = exports.doctorRegisterPatient = exports.doctorMobileNumberSignInController = exports.doctorSignInController = exports.doctorSignUpController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const doctorWallet_model_1 = __importDefault(require("../modal/doctorWallet.model"));
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const checkCompletedAccountSteps_1 = require("../../utils/checkCompletedAccountSteps");
const formidable_config_1 = require("../../config/formidable.config");
const firebase_upload_utility_1 = require("../../utils/firebase.upload.utility");
//doctor signup /////////////
const doctorSignUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber, firstName, lastName, password, title, organization, clinicCode, addresss, speciality, regNumber, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(phoneNumber);
        // try find user with the same email
        const doctorEmailExists = yield doctor_reg_modal_1.default.findOne({ email });
        const doctorNumberExists = yield doctor_reg_modal_1.default.findOne({ phoneNumber: phonenumber });
        // check if doctor exists
        if (doctorEmailExists || doctorNumberExists) {
            return res
                .status(401)
                .json({ message: "Email or Mobile Number exists already" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        let doctorClinicCode = clinicCode;
        let superDoctor = false;
        let clinicVerification = {
            isVerified: false,
        };
        clinicVerification.isVerified = true;
        if (!clinicCode || clinicCode == '') {
            doctorClinicCode = '';
            superDoctor = true;
            clinicVerification.isVerified = false;
        }
        else {
            const checkClinicCode = yield doctor_reg_modal_1.default.findOne({ clinicCode: clinicCode, superDoctor: true });
            if (!checkClinicCode) {
                return res
                    .status(401)
                    .json({ message: "incorrect clinic code" });
            }
        }
        // Save user to MongoDB
        const doctor = new doctor_reg_modal_1.default({
            email,
            firstName,
            lastName,
            phoneNumber: phonenumber,
            password: hashedPassword,
            title,
            organization,
            clinicCode: doctorClinicCode,
            clinicVerification,
            superDoctor,
            addresss,
            speciality,
            regNumber
        });
        let doctorSaved = yield doctor.save();
        if (superDoctor) {
            //create doctor wallet Account
            const doctorWallet = new doctorWallet_model_1.default({
                amount: 0,
                doctorId: doctorSaved._id
            });
            yield doctorWallet.save();
        }
        res.json({
            message: "Signup successful",
            doctor: {
                _id: doctorSaved._id,
                firstName: doctorSaved.firstName,
                lastName: doctorSaved.lastName,
                email: doctorSaved.email,
                organization: doctorSaved.organization,
                title: doctorSaved.title,
                address: doctorSaved.addresss,
                speciality: doctorSaved.speciality,
                regNumber: doctorSaved.regNumber
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSignUpController = doctorSignUpController;
//doctor signIn with email/////////////
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
        if (!doctor.emailOtp.verified) {
            return res.status(401).json({ message: "email not verified." });
        }
        if (doctor.clinicCode == '') {
            return res.status(401).json({ message: "you don't have clinic code." });
        }
        if (!doctor.clinicVerification.isVerified) {
            return res.status(401).json({ message: "clinic code not yet verified." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: doctor === null || doctor === void 0 ? void 0 : doctor._id,
            email: doctor.email,
            clinicCode: doctor.clinicCode
        }, process.env.JWT_SECRET_KEY);
        // return access token
        res.json({
            message: "Login successful",
            doctor,
            Token: accessToken
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorSignInController = doctorSignInController;
//doctor signin  with mobile number/////////////
const doctorMobileNumberSignInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, password, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // try find user with the same email
        const doctor = yield doctor_reg_modal_1.default.findOne({ phoneNumber: phonenumber });
        // check if user exists
        if (!doctor) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, doctor.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        if (!doctor.phoneNumberOtp.verified) {
            return res.status(401).json({ message: "mobile number not verified." });
        }
        if (doctor.clinicCode == '') {
            return res.status(401).json({ message: "you don't have clinic code." });
        }
        if (!doctor.clinicVerification.isVerified) {
            return res.status(401).json({ message: "clinic code not yet verified." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            _id: doctor === null || doctor === void 0 ? void 0 : doctor._id,
            email: doctor.email,
            clinicCode: doctor.clinicCode
        }, process.env.JWT_SECRET_KEY);
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
exports.doctorMobileNumberSignInController = doctorMobileNumberSignInController;
//doctor register patient /////////////
const doctorRegisterPatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, surname, phoneNumber, gender, address, dateOFBirth, hmo, medicalRecord } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctor = req.doctor;
        let patientHmo = {};
        if (hmo.upload && hmo.upload.front && hmo.upload.back) {
            patientHmo = {
                upload: hmo.upload,
                wasUploaded: true
            };
        }
        else if (hmo.inputtedDetails) {
            patientHmo = {
                inputtedDetails: hmo.inputtedDetails
            };
        }
        let formattedPhoneNumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(phoneNumber);
        let medicationImg = medicalRecord || null;
        const patient = new patient_reg_model_1.default({
            email,
            firstName,
            surname,
            phoneNumber: formattedPhoneNumber,
            gender,
            address,
            dateOFBirth,
            medicalRecord: medicationImg,
            doctorId: doctor._id,
            hmo: patientHmo,
            clinicCode: doctor.clinicCode
        });
        let patientSaved = yield patient.save();
        // save to doctors completedAccountsteps...
        doctor.completedAccountsteps.step3.addedPatients = true;
        yield doctor.save();
        return res.status(200).json({
            patient: {
                id: patientSaved._id,
                email: patientSaved.email,
                firstName: patientSaved.firstName,
                surname: patientSaved.surname,
                phoneNumber: patientSaved.phoneNumber,
                gender: patientSaved.gender,
                address: patientSaved.address,
                dateOFBirth: patientSaved.dateOFBirth,
                doctorId: patientSaved.doctorId,
                medicalRecord: medicationImg,
                hmo: patientSaved.hmo,
                clinicCode: patientSaved.clinicCode
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.doctorRegisterPatient = doctorRegisterPatient;
// upload HMO image and return upload URL...
const uploadHMOImagesToFirebase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_config_1.initializeFormidable)();
        form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({ message: "error uploading images", err });
            }
            // Extract the array of files
            const hmoImages = files['HMO_image'];
            if (!hmoImages || hmoImages.length === 0) {
                return res.status(400).json({ message: "No images found" });
            }
            if (hmoImages.length < 2) {
                return res.status(400).json({ message: "HMO images must include both front and back" });
            }
            // Array to store uploaded image URLs
            const uploadedImages = [];
            // Loop through each file and upload it
            for (const file of hmoImages) {
                try {
                    const image_url = yield (0, firebase_upload_utility_1.uploadHMOImages)(file); // Reuse your function for single file uploads
                    uploadedImages.push(image_url.url);
                }
                catch (uploadError) {
                    return res.status(500).json({ message: "Error uploading image", error: uploadError });
                }
            }
            // Send back all the uploaded image URLs
            res.status(201).json({ image_urls: uploadedImages });
        }));
    }
    catch (error) {
        res.status(500).json({ message: "Error registering patient", error });
        console.log("Error registering patient: ", error);
    }
});
exports.uploadHMOImagesToFirebase = uploadHMOImagesToFirebase;
// Decode Auth Token
const getDetailsThroughDecodedToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorEmail = req.doctor.email;
        const doctor = yield doctor_reg_modal_1.default.findOne({
            email: doctorEmail
        });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const updatedCompletedAccountSteps = yield (0, checkCompletedAccountSteps_1.updateCompletedAccountSteps)(String(doctor._id), doctor.clinicCode);
        // get the super doctor...(doctor with thesame clinic code but with superDoctor as true)
        const super_doctor = yield doctor_reg_modal_1.default.findOne({ clinicCode: doctor.clinicCode, superDoctor: true });
        // Return only necessary details
        res.json({
            doctor: {
                _id: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps._id,
                firstName: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.firstName,
                lastName: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.lastName,
                email: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.email,
                phoneNumber: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.phoneNumber,
                title: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.title,
                organization: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.organization,
                clinicCode: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.clinicCode,
                speciality: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.speciality,
                regNumber: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.regNumber,
                addresss: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.addresss,
                completedAccountSteps: updatedCompletedAccountSteps === null || updatedCompletedAccountSteps === void 0 ? void 0 : updatedCompletedAccountSteps.completedAccountSteps
            },
            superDoctor: super_doctor,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getDetailsThroughDecodedToken = getDetailsThroughDecodedToken;
