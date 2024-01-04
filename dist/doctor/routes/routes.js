"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const reg_login_validate_1 = require("../validation/reg_login_validate");
const reg_login_controller_1 = require("../controllers/reg_login.controller");
const get_patient_detail_controller_1 = require("../controllers/get_patient_detail.controller");
const forgot_password_controller_1 = require("../controllers/forgot_password.controller");
const patientPrescription_controller_1 = require("../controllers/patientPrescription.controller");
const rolechecke_middleware_1 = require("../middleware/rolechecke.middleware");
const medication_image_middleware_1 = __importDefault(require("../middleware/medication_image.middleware"));
const patientOder_controller_1 = require("../controllers/patientOder.controller");
const patientHmo_controller_1 = require("../controllers/patientHmo.controller");
router.post("/test", router.get("/", (req, res) => {
    res.json("Hello");
})); // doctor signup
router.post("/doctor_signup", reg_login_validate_1.validateDoctorSignupParams, reg_login_controller_1.doctorSignUpController); // doctor signup
router.post("/doctor_signin", reg_login_validate_1.validateDoctorSigninParams, reg_login_controller_1.doctorSignInController); // doctor login
router.post("/doctor_forgot_password", reg_login_validate_1.validateEmail, forgot_password_controller_1.doctorForgotPassworController); // doctor forgot password
router.post("/doctor_reset_password", reg_login_validate_1.validateResetPassword, forgot_password_controller_1.doctorResetPassworController); // doctor reset password
router.post("/register_patient", rolechecke_middleware_1.checkDoctorRole, medication_image_middleware_1.default, reg_login_validate_1.validatePatientRegParams, reg_login_controller_1.doctorRegisterPatient); // doctor register his patient
router.get("/all_registered_patient", rolechecke_middleware_1.checkDoctorRole, get_patient_detail_controller_1.doctorGetAllRegisteredPatient); // doctor get all his patient
router.post("/single_registered_patient", reg_login_validate_1.validatePatientid, rolechecke_middleware_1.checkDoctorRole, get_patient_detail_controller_1.doctorGetSingleRegisteredPatient); // doctor get single patient
router.post("/patient_prescription", reg_login_validate_1.validateDrugPrescription, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.patientPrescriptionController); // doctor prescribe drug for patient
router.post("/patient_prescription_detail", reg_login_validate_1.validatePatientidperson, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.patientPrescriptionDetailController); // doctor get  patient prescription
router.post("/patient_prescription_detail_delivered", reg_login_validate_1.validatePatientidperson, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.patientPrescriptionDeliveredDetailController); // doctor get  patient prescription that wass delivered
router.post("/patient_prescription_detail_not_delivered", reg_login_validate_1.validatePatientidperson, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.patientPrescriptionDetailNOTDeliveredController); // doctor get  patient prescription that was not delivered
router.post("/remove_patient_prescription", reg_login_validate_1.validatePatientPrescriptionidperson, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.doctorRemovepatientPrescriptionController); // doctor remove medication from patient prescription
router.post("/patient_order_out_of_pocket", reg_login_validate_1.validatePatientidperson, rolechecke_middleware_1.checkDoctorRole, patientOder_controller_1.doctorSendPatientOderOutOFPocketController); // doctor send patient order out of pocket
router.post("/patient_order_hmo", reg_login_validate_1.validatePatientOderHmoperson, rolechecke_middleware_1.checkDoctorRole, patientOder_controller_1.doctorSendPatientOderHmoController); // doctor send patient order hmo
router.get("/patient_order_pending", rolechecke_middleware_1.checkDoctorRole, patientOder_controller_1.doctorgetPatientOderPending); // doctor get patient order pending
router.get("/patient_order_paid", rolechecke_middleware_1.checkDoctorRole, patientOder_controller_1.doctorgetPatientOderPaid); // doctor get patient order paid
router.get("/patient_order_delieverd", rolechecke_middleware_1.checkDoctorRole, patientOder_controller_1.doctorgetPatientOderdelieverd); // doctor get patient order delivered
router.get("/patient_hmo_pending", rolechecke_middleware_1.checkDoctorRole, patientHmo_controller_1.doctorgetPatientHmoPending); // doctor get patient hmo pending
router.get("/patient_hmo_approved", rolechecke_middleware_1.checkDoctorRole, patientHmo_controller_1.doctorgetPatientHmoApproved); // doctor get patient hmo approved
router.get("/patient_hmo_denied", rolechecke_middleware_1.checkDoctorRole, patientHmo_controller_1.doctorgetPatientHmodenied); // doctor get patient hmo denied
exports.default = router;
