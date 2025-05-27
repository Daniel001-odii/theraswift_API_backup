"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const reg_login_validate_1 = require("../validation/reg_login_validate");
const reg_login_controller_1 = require("../controllers/reg_login.controller");
const getDoctorInfo_controller_1 = require("../controllers/getDoctorInfo.controller");
const get_patient_detail_controller_1 = require("../controllers/get_patient_detail.controller");
const forgot_password_controller_1 = require("../controllers/forgot_password.controller");
const patientPrescription_controller_1 = require("../controllers/patientPrescription.controller");
const rolechecke_middleware_1 = require("../middleware/rolechecke.middleware");
const upload_utility_1 = require("../../utils/upload.utility");
const medication_controller_1 = require("../controllers/medication.controller");
const patientMedicationOrder_controller_1 = require("../controllers/patientMedicationOrder.controller");
const emailVerification_controller_1 = require("../controllers/emailVerification.controller");
const patientHmo_controller_1 = require("../controllers/patientHmo.controller");
const hmoActionOnPatient_controller_1 = require("../controllers/hmoActionOnPatient.controller");
const hmoOrderAction_controller_1 = require("../controllers/hmoOrderAction.controller");
const request_clinic_code_controller_1 = require("../controllers/request_clinic_code.controller");
const pharmacyRequests_controller_1 = require("../../admin/controllers/pharmacyRequests.controller");
const pharmacyRequests_controller_2 = require("../controllers/pharmacyRequests.controller");
const doctorProfileEdit_controller_1 = require("../controllers/doctorProfileEdit.controller");
const doctor_general_controller_1 = require("../controllers/doctor.general.controller");
const doctorAccountSteps_controller_1 = require("../controllers/doctorAccountSteps.controller");
const file_upload_controller_1 = require("../../admin/controllers/file.upload.controller");
const wallet_controller_1 = require("../controllers/wallet.controller");
router.post("/test", router.get("/", (req, res) => {
    res.json("Hello");
})); // doctor signup
router.post("/doctor_signup", reg_login_validate_1.validateDoctorSignupParams, reg_login_controller_1.doctorSignUpController); // doctor signup
router.post("/doctor_send_email", reg_login_validate_1.validateDoctorSendEmailParams, emailVerification_controller_1.doctorSendEmailController); // doctor send email
router.post("/doctor_verified_email", reg_login_validate_1.validateDoctorVerifiedEmailParams, emailVerification_controller_1.doctorEmailVerificationController); // doctor verified email
router.post("/doctor_send_phone_number", reg_login_validate_1.validateDoctorSendPhoneNumberParams, emailVerification_controller_1.doctorSendPhoneNumberController); // doctor send phone number
router.post("/doctor_verified_phone_number", reg_login_validate_1.validateDoctorVerifiedPhoneNumberParams, emailVerification_controller_1.doctorPhoneNumberVerificationController); // doctor verified phone number
router.post("/doctor_signin", reg_login_validate_1.validateDoctorSigninParams, reg_login_controller_1.doctorSignInController); // doctor login with email
router.post("/doctor_signin_phone_number", reg_login_validate_1.validateDoctorSigninPhoneNumberParams, reg_login_controller_1.doctorMobileNumberSignInController); // doctor login with password
router.post("/doctor_forgot_password", reg_login_validate_1.validateEmail, forgot_password_controller_1.doctorForgotPassworController); // doctor forgot password by email
router.post("/doctor_reset_password", reg_login_validate_1.validateResetPassword, forgot_password_controller_1.doctorResetPassworController); // doctor reset password by email
router.post("/doctor_forgot_password_by_phone_number", reg_login_validate_1.validatePhonNumber, forgot_password_controller_1.doctorMobileForgotPasswordController); // doctor forgot password by phone number
router.post("/doctor_reset_password_by_phone_number", reg_login_validate_1.validateResetPasswordByPhoneNumber, forgot_password_controller_1.doctorMobileResetPasswordController); // doctor reset password by phone number
router.post("/doctor_verify_profile", rolechecke_middleware_1.checkDoctorRole, doctorAccountSteps_controller_1.doctorVerifyProfileDetails); // doctor verify profile details
router.get("/doctor_decode_token", rolechecke_middleware_1.checkDoctorRole, reg_login_controller_1.getDetailsThroughDecodedToken); // get doctor details through token
router.get("/get_doctor_info", 
// verifyToken,
reg_login_validate_1.validateGetDoctorParams, getDoctorInfo_controller_1.getDoctorInfoController);
router.post("/request_clinic_code_by_email", reg_login_validate_1.validateEmail, request_clinic_code_controller_1.doctorRequestCodeByEmailController); // doctor request clinic code by email
router.post("/request_clinic_code_by_phone", reg_login_validate_1.validatePhonNumber, request_clinic_code_controller_1.doctorRequestCodeByPhoneNumberController); // doctor request clinic code by phone number
router.post("/register_patient", rolechecke_middleware_1.checkDoctorRole, reg_login_validate_1.validatePatientRegParams, reg_login_controller_1.doctorRegisterPatient); // doctor register his patient
router.get("/all_registered_patient", rolechecke_middleware_1.checkDoctorRole, get_patient_detail_controller_1.doctorGetAllRegisteredPatient); // doctor get all his patient
router.get("/single_registered_patient", reg_login_validate_1.validatePatientid, rolechecke_middleware_1.checkDoctorRole, get_patient_detail_controller_1.doctorGetSingleRegisteredPatient); // doctor get single patient
router.get("/seach_medication_name", reg_login_validate_1.validateSearchMedByName, medication_controller_1.doctorSearchMedicationNameController); // doctor search for medication by name
router.get("/seach_medication_name_form", reg_login_validate_1.validateSearchMedByNameForm, medication_controller_1.doctorSearchMedicationNameFormController); // doctor search for medication by name and form
router.get("/seach_medication_name_form_dosage", reg_login_validate_1.validateSearchMedByNameFormDosage, medication_controller_1.doctorSearchMedicationNameFormDosageController); // doctor search for medication by name, form and dosage
router.post("/patient_prescription", reg_login_validate_1.validateDrugPrescription, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.patientPrescriptionController); // doctor prescribe drug for patient
router.get("/patient_prescription_detail/:patient_id", reg_login_validate_1.validatePatientidperson, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.patientPrescriptionDetailController); // doctor get  patient prescription
router.post("/delete_patient_prescription", reg_login_validate_1.validateDeletePatientprescription, rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.doctorDeletePatientPrescriptioController); // doctor delete  patient prescription
router.post("/patient_order_with_hmo", reg_login_validate_1.validatePatientidperson, rolechecke_middleware_1.checkDoctorRole, patientMedicationOrder_controller_1.patientOderHmoController); // order with hmo
router.post("/patient_order_with_outpocket", reg_login_validate_1.validatePatientidperson, rolechecke_middleware_1.checkDoctorRole, patientMedicationOrder_controller_1.patientOderOutPocketController); // order out of pocket
router.get("/get_patient_order_pending", reg_login_validate_1.validatePatientidQueryperson, rolechecke_middleware_1.checkDoctorRole, patientMedicationOrder_controller_1.getpatientPriscriptionPendindController); // get patient order that is pending
router.get("/get_patient_order_progress", reg_login_validate_1.validatePatientidQueryperson, rolechecke_middleware_1.checkDoctorRole, patientMedicationOrder_controller_1.getpatientPriscriptionProgressController); // get patient order that is progress
router.get("/get_patient_order_delivered", reg_login_validate_1.validatePatientidQueryperson, rolechecke_middleware_1.checkDoctorRole, patientMedicationOrder_controller_1.getpatientPriscriptionDeliverdeController); // get patient ordr that is deliverde
router.post("/sent_pateint_to_hmo", upload_utility_1.upload.single('medImg'), rolechecke_middleware_1.checkDoctorRole, patientHmo_controller_1.doctorSentPatientToHmoController); // doctor sent pateint detail to hmo
router.get("/get_patient_hmo_pendig", rolechecke_middleware_1.checkDoctorRole, patientHmo_controller_1.doctorGetPatientHmoPendingController); // doctor get patient pending
router.get("/get_patient_hmo_approve", rolechecke_middleware_1.checkDoctorRole, patientHmo_controller_1.doctorGetPatientHmoApproveController); // doctor get patient approve
router.get("/get_patient_hmo_denied", rolechecke_middleware_1.checkDoctorRole, patientHmo_controller_1.doctorGetPatientHmoDeniedController); // doctor get patient denied
// hmo action
router.get("/hmo_get_patient_sent_to_him", rolechecke_middleware_1.checkDoctorRole, hmoActionOnPatient_controller_1.hmoGetPatientSentToHimController); // hmo get patient sent to him
router.post("/hmo_aprove_denied_patient", reg_login_validate_1.validateHmoActionOnPatientSignupParams, rolechecke_middleware_1.checkDoctorRole, hmoActionOnPatient_controller_1.hmoApproveOrDeniedPatientController); // hmo approve or denied patient
router.get("/hmo_get_approve_patient", rolechecke_middleware_1.checkDoctorRole, hmoActionOnPatient_controller_1.hmoGetPatientHeApproveController); // hmo get patient he approve
router.get("/hmo_get_denied_patient", rolechecke_middleware_1.checkDoctorRole, hmoActionOnPatient_controller_1.hmoGetPatientHeDeniedController); // hmo get patient he denied
// not doc
//hmo order action 
router.get("/hmo_get_patient_order_sent_to_him", reg_login_validate_1.validateHmoGetPatientOrderParams, rolechecke_middleware_1.checkDoctorRole, hmoOrderAction_controller_1.hmoGetPatientOrderSentToHimController); // hmo get patient order sent to him
router.post("/hmo_take_action_on_order", reg_login_validate_1.validateHmoTakeActionOnPatientOrderParams, rolechecke_middleware_1.checkDoctorRole, hmoOrderAction_controller_1.hmoTakeActionOnOrderSentToHimController); // hmo take action on patient order
router.get("/hmo_get_patient_order_action_taken_on", reg_login_validate_1.validateHmoGetPatientOrderParams, rolechecke_middleware_1.checkDoctorRole, hmoOrderAction_controller_1.hmoGetPatientOrdeHeTakeActionController); // hmo get patient order he take action on
// get all pharm requests for doctor...
router.get("/pharmacy_requests", rolechecke_middleware_1.checkDoctorRole, pharmacyRequests_controller_1.getPharmacyRequestsForDoctor);
// reply to a pharmacy request or add to reply thread...
router.post("/pharmacy_requests/:request_id/reply", rolechecke_middleware_1.checkDoctorRole, pharmacyRequests_controller_2.replyPharmacyRequestById);
// edit doctor profile...
router.patch("/profile_edit", rolechecke_middleware_1.checkDoctorRole, doctorProfileEdit_controller_1.editDoctorProfile);
// Chats and Messaging...
// create new chat room btw practice & admin docs...
/* router.post("/chat_rooms/new", checkDoctorRole, createChatRoom);
router.get("/chat_rooms", checkDoctorRole, getChatRooms);
router.get("/chat_rooms/:room_id/chats", checkDoctorRole, getChatsInRoom);
router.post("/chat_rooms/:room_id/new_message", checkDoctorRole, sendChatToRoom);
 */
// add medications to existing prescription...
router.patch("/prescription/:prescription_id/add_medication", rolechecke_middleware_1.checkDoctorRole, patientPrescription_controller_1.addMedicationToPrescription);
// following and unfollowing a precriber...
router.post("/follow_doctor", rolechecke_middleware_1.checkDoctorRole, doctor_general_controller_1.followSuperDoctor);
// get lists of following...
router.get("/following_list/all", rolechecke_middleware_1.checkDoctorRole, doctor_general_controller_1.getPrescribersFollowingList);
// upload HMO image on patient registration...
router.post("/patient/HMO_image/upload", rolechecke_middleware_1.checkDoctorRole, reg_login_controller_1.uploadHMOImagesToFirebase);
// get doctors under practice...
router.get("/clinic_doctors/:clinic_code/all", rolechecke_middleware_1.checkDoctorRole, doctor_general_controller_1.getDoctorsUnderPractice);
// upload files to firebase and return location url
router.post("/files/upload", rolechecke_middleware_1.checkDoctorRole, file_upload_controller_1.uploadAnyFileToFirebase);
/*
    new routes... get patients medications
*/
router.get("/patient/:patient_id/medications", rolechecke_middleware_1.checkDoctorRole, doctor_general_controller_1.getPatientsMedications);
router.get("/medications/all_medications", rolechecke_middleware_1.checkDoctorRole, medication_controller_1.doctorGethMedicationController);
// add a practice member and send verification email...
router.post("/members/add_new", rolechecke_middleware_1.checkDoctorRole, doctor_general_controller_1.addPracticeMember);
// update practice member password...
router.patch("/members/set_password", doctor_general_controller_1.SetPracticeMemberPassword);
/*
    FUNDSSSS
*/
// setup funds wthdrawal details///
router.patch("/wallet/update", rolechecke_middleware_1.checkDoctorRole, wallet_controller_1.setFundsWithdrawalDetails);
// get doctor wallet dtails...
router.get("/wallet/details", rolechecke_middleware_1.checkDoctorRole, wallet_controller_1.getDoctorWallet);
// get all banks list...
router.get("/wallet/all_banks", rolechecke_middleware_1.checkDoctorRole, wallet_controller_1.getAllBanks);
// confirm payout details...
router.get("/wallet/confirm_details", rolechecke_middleware_1.checkDoctorRole, wallet_controller_1.confirmFundPayoutDetails);
// initiate payment...
// router.post("/wallet/initiate_payout", checkDoctorRole, initiatePayoutReference);
// withdraw funds to set bank account...
router.post("/wallet/withdraw_funds", rolechecke_middleware_1.checkDoctorRole, wallet_controller_1.withdrawFunds);
// router.post("/sms/test", testSMS);
router.get("/account_steps/check", rolechecke_middleware_1.checkDoctorRole, doctor_general_controller_1.checkDoctorAccountSteps);
exports.default = router;
