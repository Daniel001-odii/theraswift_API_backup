"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const requestValidate_middleware_1 = require("../middleware/requestValidate.middleware");
const regLogin_controller_1 = require("../controllers/regLogin.controller");
const forgotPassword_controller_1 = require("../controllers/forgotPassword.controller");
const rolechecker_middleware_1 = require("../middleware/rolechecker.middleware");
const medication_controller_1 = require("../controllers/medication.controller");
const upload_utility_1 = require("../../utils/upload.utility");
const userDetail_controller_1 = require("../controllers/userDetail.controller");
const order_controller_1 = require("../controllers/order.controller");
//import { adminGetDeliverdDoctorOder, adminGetPaidDoctorOder, adminGetPendingDoctorOder } from "../controllers/orderFromDoctor.controller";
const essentialCategory_controller_1 = require("../controllers/essentialCategory.controller");
const essentialProduct_controller_1 = require("../controllers/essentialProduct.controller");
const emailPhoneNumberVerification_1 = require("../controllers/emailPhoneNumberVerification");
const frequencAskAndNewsletter_controller_1 = require("../controllers/frequencAskAndNewsletter.controller");
const doctorDetail_controller_1 = require("../controllers/doctorDetail.controller");
const doctorPatientPrescription_controller_1 = require("../controllers/doctorPatientPrescription.controller");
const hmoDetail_controller_1 = require("../controllers/hmoDetail.controller");
const sendOrderToHmo_controller_1 = require("../controllers/sendOrderToHmo.controller");
const awaitingMedication_controller_1 = require("../controllers/awaitingMedication.controller");
const dashBoard_controller_1 = require("../controllers/dashBoard.controller");
const pharmacyRequests_controller_1 = require("../controllers/pharmacyRequests.controller");
router.post("/admin_signup", requestValidate_middleware_1.validateSignupParams, regLogin_controller_1.adminSignUpController); // admin signup
router.post("/admin_send_email", requestValidate_middleware_1.validateSendEmailigninParams, emailPhoneNumberVerification_1.adminSendEmailController); // admin send emai
router.post("/admin_Verify_email", requestValidate_middleware_1.validateVerifyEmailEmailigninParams, emailPhoneNumberVerification_1.adminEmailVerificationController); // admin verified email
router.post("/admin_send_phone_number", requestValidate_middleware_1.validateSendPhoneNumberParams, emailPhoneNumberVerification_1.adminSendPhoneNumberController); // admin send phone number
router.post("/admin_Verify_phone_number", requestValidate_middleware_1.validateVerifyPhoneNumbweParams, emailPhoneNumberVerification_1.adminPhoneNumberVerificationController); // admin verified phone number
router.post("/admin_signin", requestValidate_middleware_1.validateAdminSigninParams, regLogin_controller_1.adminSignInController); // admin login by email
router.post("/admin_signin_phone_number", requestValidate_middleware_1.validateAdminSigninPhonNumberParams, regLogin_controller_1.adminMobileNumberSignInController); // admin login by phone number
router.post("/admin_forgot_password", requestValidate_middleware_1.validateEmail, forgotPassword_controller_1.adminForgotPassworController); // admin forgot password by email
router.post("/admin_reset_password", requestValidate_middleware_1.validateResetPassword, forgotPassword_controller_1.adminResetPassworController); // admin reset password by email
router.post("/admin_forgot_password_by_phone_number", requestValidate_middleware_1.validatePhonNumber, forgotPassword_controller_1.adminMobileForgotPasswordController); // admin forgot password by phone number
router.post("/admin_reset_password_by_phone_number", requestValidate_middleware_1.validateResetPasswordByPhoneNumber, forgotPassword_controller_1.adminMobileResetPasswordController); // admin reset password by phone number
router.get("/dashboard", rolechecker_middleware_1.checkAdminRole, dashBoard_controller_1.dashboardController); // dash board
router.get("/expired_medication", rolechecker_middleware_1.checkAdminRole, dashBoard_controller_1.expiredMedicationController); // get expired medication
router.post("/admin_add_medication", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('medicationImg'), requestValidate_middleware_1.validateMedicationParams, requestValidate_middleware_1.validateFormData, medication_controller_1.adminAddMedicationController); // admin add medication to databas
router.post("/admin_edit_medication", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('medicationImg'), requestValidate_middleware_1.validateMedicationEditParams, requestValidate_middleware_1.validateFormData, medication_controller_1.adminEditMedicationController); // admin add medication to databas
router.post("/admin_delete_medication", requestValidate_middleware_1.validateMedicationDeleteParams, rolechecker_middleware_1.checkAdminRole, medication_controller_1.adminDeleteMedicationController); // admin add medication to databas
router.get("/admin_all_medication", medication_controller_1.getAllMedicationController); // get all medication
router.post("/admin_single_medication", requestValidate_middleware_1.validateMedicationDeleteParams, medication_controller_1.getsingleMedicationController); // get single medication
router.post("/number_medication", medication_controller_1.getSpecificNumbereMedicationController); // get specific number of medication
router.post("/page_medication", medication_controller_1.getPageMedicationController); // get page of medication
router.get("/total_medication", medication_controller_1.getTotalMedicationController); // get total medication
router.get("/all_user", rolechecker_middleware_1.checkAdminRole, userDetail_controller_1.getAllUsersController); // get total medication
router.get("/page_user", rolechecker_middleware_1.checkAdminRole, userDetail_controller_1.getPageUserDeatilController); // get page medication
router.get("/single_user", requestValidate_middleware_1.validateUserParams, rolechecker_middleware_1.checkAdminRole, userDetail_controller_1.getsingleUserController); // get single medication
router.get("/all_order_not_deliver", rolechecker_middleware_1.checkAdminRole, order_controller_1.getAllOrderNotDeliveredController); // get total order not deliver
router.get("/page_order_not_deliver", rolechecker_middleware_1.checkAdminRole, order_controller_1.getPageOrderNotDeliveredController); // get page order not deliver
router.get("/single_order_not_deliver", requestValidate_middleware_1.validateOrderParams, rolechecker_middleware_1.checkAdminRole, order_controller_1.getSingleOrderNotDeliveredController); // get single oder not delivered
router.get("/all_order_deliver", rolechecker_middleware_1.checkAdminRole, order_controller_1.getAllOrderDeliveredController); // get total order delivered
router.get("/page_order_deliver", rolechecker_middleware_1.checkAdminRole, order_controller_1.getPageOrderDeliveredController); // get page order delivered
router.get("/single_order_deliver", requestValidate_middleware_1.validateOrderParams, rolechecker_middleware_1.checkAdminRole, order_controller_1.getSingleOrderDeliveredController); // get single oder delivered
router.get("/pending order", rolechecker_middleware_1.checkAdminRole, order_controller_1.getPageOrderNotpendingController); // get pending order
router.post("/delivered_order", requestValidate_middleware_1.validateOrderPostParams, rolechecker_middleware_1.checkAdminRole, order_controller_1.DeliveredOrderController); //  delivered order
//essential
router.post("/create_category", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('categoryImg'), essentialCategory_controller_1.createEssentialCategoryController); //  create essential category
router.get("/get_category", rolechecker_middleware_1.checkAdminRole, essentialCategory_controller_1.getAllEssentialCategoryController); // get essential category
router.get("/get_page_category", rolechecker_middleware_1.checkAdminRole, essentialCategory_controller_1.getPageEssentialCategoryController); // get essential category
router.post("/delete_category", rolechecker_middleware_1.checkAdminRole, requestValidate_middleware_1.validateCategoryIDParams, essentialCategory_controller_1.deleteEssentialCategoryController); // delete category
router.post("/create_product", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('productImg'), essentialProduct_controller_1.adminAddEssentialProductController); // create essential product
router.get("/get_product", rolechecker_middleware_1.checkAdminRole, essentialProduct_controller_1.getPageEssentialProductController); // get essential page product
router.get("/search_product_name", rolechecker_middleware_1.checkAdminRole, essentialProduct_controller_1.searchEssentialProductByNameController); // get essential product by name
router.get("/get_single_product", rolechecker_middleware_1.checkAdminRole, requestValidate_middleware_1.validatEssentialProuctIdQueryarams, essentialProduct_controller_1.getSingleEssentialProductByNameController); // get single essential product by name
router.post("/edit_product", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('productImg'), essentialProduct_controller_1.editEssentialProductController); // edit essential Product
router.post("/delete_product", requestValidate_middleware_1.validatEssentialProuctIdParams, rolechecker_middleware_1.checkAdminRole, essentialProduct_controller_1.deleteEssentialProductController); //delete essential product
router.post("/frequence_ask", requestValidate_middleware_1.validatFrequenceAskParams, rolechecker_middleware_1.checkAdminRole, frequencAskAndNewsletter_controller_1.adminFrequenceAskController); // add question and answe
router.get("/get_newsletters", rolechecker_middleware_1.checkAdminRole, frequencAskAndNewsletter_controller_1.adminNewsletterSubcriberController); // get newslw=etter subscriber
router.post("/email/link", requestValidate_middleware_1.validatepatientIdParams, rolechecker_middleware_1.checkAdminRole, awaitingMedication_controller_1.adminSendingPatientOrderToEmail); // send link through email
router.post("/sms/link", requestValidate_middleware_1.validatepatientIdParams, rolechecker_middleware_1.checkAdminRole, awaitingMedication_controller_1.adminSendingPatientOrderToSms); // send link through sms
/////////////////////////////////
//////// doctor ///////////////
/////////////////////////////
// router.get("/doctor_order_pending", checkAdminRole, adminGetPendingDoctorOder); // get order from doctor that is pending
// router.get("/doctor_order_paid", checkAdminRole, adminGetPaidDoctorOder); // get order from doctor that is paid
// router.get("/doctor_order_delivered", checkAdminRole, adminGetDeliverdDoctorOder); // get order from doctor that is delived
router.get("/doctor_detail", rolechecker_middleware_1.checkAdminRole, doctorDetail_controller_1.adminGetDoctor); // get doctor detail
router.get("/doctor_single_detail", requestValidate_middleware_1.validatDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorDetail_controller_1.adminGetSingleDoctorOder); // get single doctor detail
router.get("/patient_doctor_detail", requestValidate_middleware_1.validatPatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorDetail_controller_1.adminGetPatientUnderDoctor); // get patient under doctor detail
router.get("/patient_doctor_single_detail", requestValidate_middleware_1.validatSinglePatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorDetail_controller_1.adminGetSinglePatientUnderDoctorOder); // get single patient doctor detail
router.get("/get_doctor_reqest_clinic_code", rolechecker_middleware_1.checkAdminRole, doctorDetail_controller_1.adminGetDoctorRequestClinicCode); // admin get doctor that request clinic code
router.post("/send_clinic_code_to_email", requestValidate_middleware_1.validateDoctorEmailParams, rolechecker_middleware_1.checkAdminRole, doctorDetail_controller_1.adminGiveDoctorClinicCode); // admin sent clinic code for doctor by email
router.post("/send_clinic_code_to_phone_number", requestValidate_middleware_1.validateDoctorPhoneNumberParams, rolechecker_middleware_1.checkAdminRole, doctorDetail_controller_1.adminGiveDoctorClinicCodebyPhoneNumber); // admin sent clinic code for doctor by phone number
router.get("/patient_pending_order_under_doctor", requestValidate_middleware_1.validatPatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorPatientPrescription_controller_1.adminGetDoctorPendingPatientOrder); // get patient pending order under doctor
router.get("/single_patient_pending_order_under_doctor", requestValidate_middleware_1.validatSinglePatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorPatientPrescription_controller_1.adminGetDoctorSinglePendingPatientOrder); // get single patient pending order under doctor
router.get("/patient_progress_order_under_doctor", requestValidate_middleware_1.validatPatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorPatientPrescription_controller_1.adminGetDoctorPatientProgressOrder); // get patient progress order under doctor
router.get("/single_patient_progress_order_under_doctor", requestValidate_middleware_1.validatSinglePatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorPatientPrescription_controller_1.adminGetDoctorSingleProgressPatientOrder); // get single patient progress order under doctor
router.get("/patient_delivered_order_under_doctor", requestValidate_middleware_1.validatPatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorPatientPrescription_controller_1.adminGetDoctorDeliveredPatientOrder); // get patient delivered order under doctor
router.get("/single_patient_delivered_order_under_doctor", requestValidate_middleware_1.validatSinglePatientUnderDoctorIdParams, rolechecker_middleware_1.checkAdminRole, doctorPatientPrescription_controller_1.adminGetDoctorSingleDeliveredPatientOrder); // get single patient delivered order under doctor
router.get("/hmo_detail", rolechecker_middleware_1.checkAdminRole, hmoDetail_controller_1.adminGetHmo); // get hmo detail
router.get("/hmo_single_detail", requestValidate_middleware_1.validatHmoIdParams, rolechecker_middleware_1.checkAdminRole, hmoDetail_controller_1.adminGetSingleHmo); // get single hmo detail
router.post("/admin_sent_order_to_hmo", requestValidate_middleware_1.validateAdminSentOrderToHmoParams, rolechecker_middleware_1.checkAdminRole, sendOrderToHmo_controller_1.adminSendingPatientOrderToHmo); // admin sent patient order to hmo
router.get("/admin_get_order_sent_to_hmo", requestValidate_middleware_1.validateAdminGettOrderToHmoParams, rolechecker_middleware_1.checkAdminRole, sendOrderToHmo_controller_1.adminGetPatientOrderSentToHmo); // admin get patient order sent to hmo
// chats and messaging...
/* router.post("/chat_rooms/new", checkAdminRole, createChatRoom);
router.get("/chat_rooms", checkAdminRole, getChatRooms);
router.get("/chat_rooms/:room_id/chats", checkAdminRole, getChatsInRoom);
router.post("/chat_rooms/:room_id/new_message", checkAdminRole, sendChatToRoom);

 */
// Pharmacy requests creation and retrieval
router.get("/requests", rolechecker_middleware_1.checkAdminRole, pharmacyRequests_controller_1.getAllSentRequest);
router.post("/requests/:doctor_id/new", rolechecker_middleware_1.checkAdminRole, pharmacyRequests_controller_1.sendPharmacyRequest);
// mark pharmacy request as solved...
router.post("/requests/:request_id/solved", rolechecker_middleware_1.checkAdminRole, pharmacyRequests_controller_1.markPharmacyRequestAsSolved);
// doctor verification...
router.post("/:doctor_id/verify", rolechecker_middleware_1.checkAdminRole, dashBoard_controller_1.verifyDoctorById);
// controller for general file uploads....
// router.post("/files/upload", checkAdminRole, uploadAnyFileToFirebase);
exports.default = router;
