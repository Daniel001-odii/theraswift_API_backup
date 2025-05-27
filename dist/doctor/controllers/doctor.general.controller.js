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
exports.checkDoctorAccountSteps = exports.testSMS = exports.SetPracticeMemberPassword = exports.addPracticeMember = exports.getPatientsMedications = exports.getDoctorsUnderPractice = exports.getPrescribersFollowingList = exports.followSuperDoctor = void 0;
// import MedicationModel from "../../admin/models/medication.model";
const medication_model_1 = __importDefault(require("../../user/models/medication.model"));
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const patient_reg_model_1 = __importDefault(require("../modal/patient_reg.model"));
const sendEmailGeneral_1 = require("../../utils/sendEmailGeneral");
const onboardPracticeDoctorTemplate_1 = require("../../templates/doctor/onboardPracticeDoctorTemplate");
const bcrypt_1 = __importDefault(require("bcrypt"));
const tiwlioSmsSender_1 = require("../../utils/tiwlioSmsSender");
const followSuperDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const practice_doc_id = req.doctor._id;
        const practice_doc = req.doctor;
        const { doctor } = req.body;
        if (!doctor) {
            return res.status(400).json({ message: "Please provide a valid doctor id" });
        }
        // Find the super doctor by ID
        const doctor_model = yield doctor_reg_modal_1.default.findById(doctor);
        /*
            if (!doctor_model || doctor_model.superDoctor !== true) {
              return res.status(400).json({ message: "Sorry, you can only follow a super doctor" });
            } */
        // Find the practice doctor
        const practice_doc_model = yield doctor_reg_modal_1.default.findById(practice_doc_id);
        // Check if the practice doctor is already following the super doctor
        const isFollowing = doctor_model.followers.some((follower) => follower._id.toString() === practice_doc_id.toString());
        if (isFollowing) {
            // Unfollow logic: remove the practice doctor from super doctor's followers
            doctor_model.followers = doctor_model.followers.filter((follower) => follower._id.toString() !== practice_doc_id.toString());
            // Remove the super doctor from practice doctor's following
            practice_doc_model.following = practice_doc_model.following.filter((follow) => follow._id.toString() !== doctor.toString());
            yield doctor_model.save();
            yield practice_doc_model.save();
            return res.status(200).json({ message: `You have unfollowed ${doctor_model.firstName} ${doctor_model.lastName}` });
        }
        else {
            // Follow logic: add the practice doctor to super doctor's followers
            doctor_model.followers.push({ _id: practice_doc_id, name: `${practice_doc_model.firstName} ${practice_doc_model.lastName}` });
            // Add the super doctor to practice doctor's following
            practice_doc_model.following.push({ _id: doctor_model._id, name: `${doctor_model.firstName} ${doctor_model.lastName}` });
            yield doctor_model.save();
            yield practice_doc_model.save();
            return res.status(201).json({ message: `You are now following ${doctor_model.firstName} ${doctor_model.lastName}` });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error following/unfollowing doctor", error });
        console.log("Error following/unfollowing doctor:", error);
    }
});
exports.followSuperDoctor = followSuperDoctor;
// get lists of doctors.prescribers being followed..
const getPrescribersFollowingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const practice_doc = yield doctor_reg_modal_1.default.findById(req.doctor._id);
        const following = practice_doc.following;
        res.status(200).json({ following });
    }
    catch (error) {
        res.status(500).json({ message: "error getting list of prescribers being followed" });
    }
});
exports.getPrescribersFollowingList = getPrescribersFollowingList;
const getDoctorsUnderPractice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clinic_code = req.params.clinic_code;
        const doctors = yield doctor_reg_modal_1.default.find({
            clinicCode: clinic_code
        }, "firstName lastName email phoneNumber title organization clinicCode superDoctor addresss specialty regnumber");
        if (!doctors) {
            return res.status(404).json({ message: "sorry, the requested doctor was not found" });
        }
        res.status(200).json({ doctors });
    }
    catch (error) {
        res.status(500).json({ message: "error getting practice doctors" });
    }
});
exports.getDoctorsUnderPractice = getDoctorsUnderPractice;
//get patients medications...
const getPatientsMedications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.doctor._id;
        const doctor = req.doctor;
        const userId = req.params.patient_id;
        if (!userId) {
            return res.status(400).json({ message: "missing patient_id in url params" });
        }
        /*   const patient = await PatientModel.findById(userId, {
            email: 1,
            firstName: 1,
            surname: 1,
            phoneNumber: 1,
            hmo: 1,
            dateOFBirth: 1,
            _id: 0,
          }); */
        const patient = yield patient_reg_model_1.default.findById(userId);
        /*
          patient doesnt have a DOB property unlike the design..
        */
        if (!patient) {
            return res.status(400).json({ message: "patient not found or does not exist" });
        }
        // const medications = await MedicationModel.find().populate("medicationId");
        const medications = yield medication_model_1.default.find({ userId }, {
            last_filled_date: 1,
            refills_left: 1,
            status: 1,
            createdAt: 1,
        }).populate({ path: "medicationId", select: "name" });
        res.status(200).json({ medications, patient });
    }
    catch (error) {
        res.status(500).json({ message: "error getting patients medications" });
        console.log("error getting patients medications: ", error);
    }
});
exports.getPatientsMedications = getPatientsMedications;
// adding a practice member (fellow smaller doctors who share similar practice code)
const addPracticeMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const super_doctor = req.doctor;
        const doctor = yield doctor_reg_modal_1.default.findById(super_doctor._id);
        const { email, phoneNumber, firstName, lastName, password, title, organization, addresss, speciality, regNumber, } = req.body;
        // verify input from client...
        if (!email || !phoneNumber || !firstName || !lastName || !password || !title || !organization || !addresss || !speciality || !regNumber) {
            return res.status(400).json({ message: "request body is missing a required field, please check and try again!" });
        }
        const existing_email = yield doctor_reg_modal_1.default.findOne({ email });
        if (existing_email) {
            return res.status(401).json({ message: "doctor with email already exists, try another email!" });
        }
        // create new practice doctor...
        const practice_doctor = new doctor_reg_modal_1.default({
            email,
            phoneNumber,
            firstName,
            lastName,
            password,
            title,
            organization,
            addresss,
            speciality,
            regNumber
        });
        // assign the main doctors clinic code to practice doctor ...
        practice_doctor.clinicCode = super_doctor.clinicCode;
        // Set an expiration time for the emai (e.g., 1 hour)
        const mail_expiry = Date.now() + 3600000; // 1 hour
        practice_doctor.emailOtp.createdTime = new Date(mail_expiry);
        yield practice_doctor.save();
        // set doctors completedAccountSteps...
        doctor.completedAccountSteps.step1.addedProviders = true;
        yield doctor.save();
        // send email link to new practice doctor for verification/email..
        const email_payload = {
            emailTo: email,
            subject: 'You\'ve been added as a practice doctor!',
            html: (0, onboardPracticeDoctorTemplate_1.practiceDoctorVerificationEmail)(firstName, practice_doctor._id.toString())
        };
        yield (0, sendEmailGeneral_1.sendEmail)(email_payload);
        res.status(200).json({ message: `${firstName} ${lastName} successfully added as a practice member, password reset email sent`, practice_doctor });
    }
    catch (error) {
        res.status(500).json({ message: "error adding practice member" });
        console.log("error adding practice member: ", error);
    }
});
exports.addPracticeMember = addPracticeMember;
// setting up password for practice doctors
const SetPracticeMemberPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const practice_doc_id = req.params.doctor_id;
        const { practice_doc_id, password } = req.body;
        if (!practice_doc_id || !password) {
            return res.status(400).json({ message: "body missing required field, please check!" });
        }
        const practice_doctor = yield doctor_reg_modal_1.default.findOne({ _id: practice_doc_id, 'emailOtp.createdTime': { $gt: new Date() } });
        if (!practice_doctor) {
            return res.status(404).json({ message: "invalid code provided or doctor not found :(" });
        }
        ;
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        practice_doctor.password = hashedPassword;
        practice_doctor.clinicVerification.isVerified = true;
        practice_doctor.emailOtp.createdTime = new Date();
        yield practice_doctor.save();
        res.status(200).json({ message: "doctor verified and password updated successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: "error setting up password for p-member" });
        console.log("error setting up password for p-member: ", error);
    }
});
exports.SetPracticeMemberPassword = SetPracticeMemberPassword;
// temporary endpoint for sending test SMS
const testSMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { sms } = req.body;
        const sms_payload = {
            to: "+2348106613834",
            sms: "Hell world"
        };
        const result = yield (0, tiwlioSmsSender_1.sendTwilioSMS)(sms_payload);
        res.status(200).json({ message: "test sms sent!", result });
    }
    catch (error) {
        console.log("error sending test sms: ", error);
        res.status(500).json({ message: "error, cant send SMS internal server error" });
    }
});
exports.testSMS = testSMS;
const checkDoctorAccountSteps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.doctor._id;
        const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
        const account_steps = doctor === null || doctor === void 0 ? void 0 : doctor.completedAccountSteps;
        res.status(200).json({ account_steps });
    }
    catch (error) {
        console.log("error checking completed account steps: ", error);
        res.status(500).json({ message: "error checking completed account steps..." });
    }
});
exports.checkDoctorAccountSteps = checkDoctorAccountSteps;
