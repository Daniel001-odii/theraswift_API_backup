const express = require("express");
const router = express.Router();
import { 
    validatDoctorIdParams,
    validatEssentialCategoryParams,
    validatEssentialProuctIdParams,
    validatEssentialProuctIdQueryarams,
    validatFrequenceAskParams,
    validatHmoIdParams,
    validatPatientUnderDoctorIdParams,
    validatSinglePatientUnderDoctorIdParams,
    validateAdminGettOrderToHmoParams,
    validateAdminSentOrderToHmoParams,
    validateAdminSigninParams,
    validateAdminSigninPhonNumberParams,
    validateCategoryIDParams,
    validateDoctorEmailParams,
    validateDoctorPhoneNumberParams,
    validateEmail,
    validateFormData,
    validateMedicationDeleteParams,
    validateMedicationEditParams,
    validateMedicationParams,
    validateOrderParams,
    validateOrderPostParams,
    validatePhonNumber,
    validateResetPassword,
    validateResetPasswordByPhoneNumber,
    validateSendEmailigninParams,
    validateSendPhoneNumberParams,
    validateSignupParams,
    validateUserParams,
    validateVerifyEmailEmailigninParams,
    validateVerifyPhoneNumbweParams,
    validatepatientIdParams
} from "../middleware/requestValidate.middleware";

import { adminMobileNumberSignInController, adminSignInController, adminSignUpController } from "../controllers/regLogin.controller";
import {
     adminForgotPassworController, 
     adminMobileForgotPasswordController, 
     adminMobileResetPasswordController, 
     adminResetPassworController 
} from "../controllers/forgotPassword.controller";
import { checkAdminRole } from "../middleware/rolechecker.middleware";
import { adminAddMedicationController, adminDeleteMedicationController, adminEditMedicationController, getAllMedicationController, getPageMedicationController, getSpecificNumbereMedicationController, getTotalMedicationController, getsingleMedicationController } from "../controllers/medication.controller";
import imgae from "../middleware/image.middleware";
import { upload } from "../../utils/upload.utility";
import { getAllUsersController, getPageUserDeatilController, getsingleUserController } from "../controllers/userDetail.controller";
import { DeliveredOrderController, getAllOrderDeliveredController, getAllOrderNotDeliveredController, getPageOrderDeliveredController, getPageOrderNotDeliveredController, getPageOrderNotpendingController, getSingleOrderDeliveredController, getSingleOrderNotDeliveredController } from "../controllers/order.controller";
//import { adminGetDeliverdDoctorOder, adminGetPaidDoctorOder, adminGetPendingDoctorOder } from "../controllers/orderFromDoctor.controller";
import { createEssentialCategoryController, deleteEssentialCategoryController, getAllEssentialCategoryController, getPageEssentialCategoryController } from "../controllers/essentialCategory.controller";
import { adminAddEssentialProductController, deleteEssentialProductController, editEssentialProductController, getPageEssentialProductController, getSingleEssentialProductByNameController, searchEssentialProductByNameController } from "../controllers/essentialProduct.controller";
import { adminEmailVerificationController, adminPhoneNumberVerificationController, adminSendEmailController, adminSendPhoneNumberController } from "../controllers/emailPhoneNumberVerification";
import { adminFrequenceAskController, adminNewsletterSubcriberController } from "../controllers/frequencAskAndNewsletter.controller";
import { adminGetDoctor, adminGetDoctorRequestClinicCode, adminGetPatientUnderDoctor, adminGetSingleDoctorOder, adminGetSinglePatientUnderDoctorOder, adminGiveDoctorClinicCode, adminGiveDoctorClinicCodebyPhoneNumber } from "../controllers/doctorDetail.controller";
import { adminGetDoctorDeliveredPatientOrder, adminGetDoctorPatientProgressOrder, adminGetDoctorPendingPatientOrder, adminGetDoctorSingleDeliveredPatientOrder, adminGetDoctorSinglePendingPatientOrder, adminGetDoctorSingleProgressPatientOrder } from "../controllers/doctorPatientPrescription.controller";
import { adminGetHmo, adminGetSingleHmo } from "../controllers/hmoDetail.controller";
import { adminGetPatientOrderSentToHmo, adminSendingPatientOrderToHmo } from "../controllers/sendOrderToHmo.controller";
import { adminSendingPatientOrderToEmail, adminSendingPatientOrderToSms } from "../controllers/awaitingMedication.controller";
import { dashboardController, expiredMedicationController, verifyDoctorById } from "../controllers/dashBoard.controller";


// FOR CHATS AND MESSAGING...
import { createChatRoom } from "../controllers/chat.controller";
import { getChatRooms } from "../controllers/chat.controller";
import { getChatsInRoom } from "../controllers/chat.controller";
import { sendChatToRoom } from "../controllers/chat.controller";
import { getAllSentRequest, markPharmacyRequestAsSolved, sendPharmacyRequest } from "../controllers/pharmacyRequests.controller";
import { uploadAnyFileToFirebase } from "../controllers/file.upload.controller";




router.post("/admin_signup", validateSignupParams, adminSignUpController); // admin signup
router.post("/admin_send_email", validateSendEmailigninParams, adminSendEmailController); // admin send emai
router.post("/admin_Verify_email", validateVerifyEmailEmailigninParams, adminEmailVerificationController); // admin verified email
router.post("/admin_send_phone_number", validateSendPhoneNumberParams, adminSendPhoneNumberController); // admin send phone number
router.post("/admin_Verify_phone_number", validateVerifyPhoneNumbweParams, adminPhoneNumberVerificationController); // admin verified phone number
router.post("/admin_signin", validateAdminSigninParams, adminSignInController); // admin login by email
router.post("/admin_signin_phone_number", validateAdminSigninPhonNumberParams, adminMobileNumberSignInController); // admin login by phone number
router.post("/admin_forgot_password", validateEmail, adminForgotPassworController); // admin forgot password by email
router.post("/admin_reset_password", validateResetPassword, adminResetPassworController); // admin reset password by email
router.post("/admin_forgot_password_by_phone_number", validatePhonNumber, adminMobileForgotPasswordController); // admin forgot password by phone number
router.post("/admin_reset_password_by_phone_number", validateResetPasswordByPhoneNumber, adminMobileResetPasswordController); // admin reset password by phone number

router.get("/dashboard", checkAdminRole, dashboardController); // dash board
router.get("/expired_medication", checkAdminRole, expiredMedicationController); // get expired medication



router.post("/admin_add_medication", checkAdminRole, upload.single('medicationImg'), validateMedicationParams, validateFormData, adminAddMedicationController); // admin add medication to databas
router.post("/admin_edit_medication", checkAdminRole, upload.single('medicationImg'), validateMedicationEditParams, validateFormData, adminEditMedicationController); // admin add medication to databas
router.post("/admin_delete_medication", validateMedicationDeleteParams, checkAdminRole,  adminDeleteMedicationController); // admin add medication to databas
router.get("/admin_all_medication",  getAllMedicationController); // get all medication
router.post("/admin_single_medication", validateMedicationDeleteParams, getsingleMedicationController); // get single medication
router.post("/number_medication", getSpecificNumbereMedicationController); // get specific number of medication
router.post("/page_medication", getPageMedicationController); // get page of medication
router.get("/total_medication", getTotalMedicationController); // get total medication


router.get("/all_user", checkAdminRole, getAllUsersController); // get total medication
router.get("/page_user", checkAdminRole, getPageUserDeatilController); // get page medication
router.get("/single_user", validateUserParams, checkAdminRole, getsingleUserController); // get single medication


router.get("/all_order_not_deliver", checkAdminRole, getAllOrderNotDeliveredController); // get total order not deliver
router.get("/page_order_not_deliver", checkAdminRole, getPageOrderNotDeliveredController); // get page order not deliver
router.get("/single_order_not_deliver", validateOrderParams, checkAdminRole, getSingleOrderNotDeliveredController); // get single oder not delivered
router.get("/all_order_deliver", checkAdminRole, getAllOrderDeliveredController); // get total order delivered
router.get("/page_order_deliver", checkAdminRole, getPageOrderDeliveredController); // get page order delivered
router.get("/single_order_deliver", validateOrderParams, checkAdminRole, getSingleOrderDeliveredController); // get single oder delivered
router.get("/pending order", checkAdminRole, getPageOrderNotpendingController); // get pending order
router.post("/delivered_order", validateOrderPostParams, checkAdminRole, DeliveredOrderController); //  delivered order

//essential
router.post("/create_category", checkAdminRole, upload.single('categoryImg'), createEssentialCategoryController); //  create essential category
router.get("/get_category", checkAdminRole, getAllEssentialCategoryController); // get essential category
router.get("/get_page_category", checkAdminRole, getPageEssentialCategoryController); // get essential category
router.post("/delete_category", checkAdminRole, validateCategoryIDParams, deleteEssentialCategoryController); // delete category
router.post("/create_product",  checkAdminRole, upload.single('productImg'), adminAddEssentialProductController); // create essential product
router.get("/get_product",  checkAdminRole, getPageEssentialProductController); // get essential page product
router.get("/search_product_name",  checkAdminRole, searchEssentialProductByNameController); // get essential product by name
router.get("/get_single_product",  checkAdminRole, validatEssentialProuctIdQueryarams, getSingleEssentialProductByNameController); // get single essential product by name
router.post("/edit_product",  checkAdminRole, upload.single('productImg'),  editEssentialProductController); // edit essential Product
router.post("/delete_product", validatEssentialProuctIdParams,  checkAdminRole, deleteEssentialProductController); //delete essential product


router.post("/frequence_ask", validatFrequenceAskParams,  checkAdminRole, adminFrequenceAskController); // add question and answe
router.get("/get_newsletters",  checkAdminRole, adminNewsletterSubcriberController); // get newslw=etter subscriber

router.post("/email/link", validatepatientIdParams,  checkAdminRole, adminSendingPatientOrderToEmail); // send link through email
router.post("/sms/link", validatepatientIdParams,   checkAdminRole, adminSendingPatientOrderToSms); // send link through sms


/////////////////////////////////
//////// doctor ///////////////
/////////////////////////////
// router.get("/doctor_order_pending", checkAdminRole, adminGetPendingDoctorOder); // get order from doctor that is pending
// router.get("/doctor_order_paid", checkAdminRole, adminGetPaidDoctorOder); // get order from doctor that is paid
// router.get("/doctor_order_delivered", checkAdminRole, adminGetDeliverdDoctorOder); // get order from doctor that is delived


router.get("/doctor_detail", checkAdminRole, adminGetDoctor); // get doctor detail
router.get("/doctor_single_detail", validatDoctorIdParams, checkAdminRole, adminGetSingleDoctorOder); // get single doctor detail
router.get("/patient_doctor_detail", validatPatientUnderDoctorIdParams, checkAdminRole, adminGetPatientUnderDoctor); // get patient under doctor detail
router.get("/patient_doctor_single_detail", validatSinglePatientUnderDoctorIdParams, checkAdminRole, adminGetSinglePatientUnderDoctorOder); // get single patient doctor detail

router.get("/get_doctor_reqest_clinic_code", checkAdminRole, adminGetDoctorRequestClinicCode); // admin get doctor that request clinic code
router.post("/send_clinic_code_to_email", validateDoctorEmailParams, checkAdminRole, adminGiveDoctorClinicCode); // admin sent clinic code for doctor by email
router.post("/send_clinic_code_to_phone_number", validateDoctorPhoneNumberParams, checkAdminRole, adminGiveDoctorClinicCodebyPhoneNumber); // admin sent clinic code for doctor by phone number

router.get("/patient_pending_order_under_doctor", validatPatientUnderDoctorIdParams, checkAdminRole, adminGetDoctorPendingPatientOrder); // get patient pending order under doctor
router.get("/single_patient_pending_order_under_doctor", validatSinglePatientUnderDoctorIdParams, checkAdminRole, adminGetDoctorSinglePendingPatientOrder); // get single patient pending order under doctor
router.get("/patient_progress_order_under_doctor", validatPatientUnderDoctorIdParams, checkAdminRole, adminGetDoctorPatientProgressOrder); // get patient progress order under doctor
router.get("/single_patient_progress_order_under_doctor", validatSinglePatientUnderDoctorIdParams, checkAdminRole, adminGetDoctorSingleProgressPatientOrder); // get single patient progress order under doctor
router.get("/patient_delivered_order_under_doctor", validatPatientUnderDoctorIdParams, checkAdminRole, adminGetDoctorDeliveredPatientOrder); // get patient delivered order under doctor
router.get("/single_patient_delivered_order_under_doctor", validatSinglePatientUnderDoctorIdParams, checkAdminRole, adminGetDoctorSingleDeliveredPatientOrder); // get single patient delivered order under doctor

router.get("/hmo_detail", checkAdminRole, adminGetHmo); // get hmo detail
router.get("/hmo_single_detail", validatHmoIdParams, checkAdminRole, adminGetSingleHmo); // get single hmo detail

router.post("/admin_sent_order_to_hmo", validateAdminSentOrderToHmoParams, checkAdminRole, adminSendingPatientOrderToHmo); // admin sent patient order to hmo
router.get("/admin_get_order_sent_to_hmo", validateAdminGettOrderToHmoParams, checkAdminRole, adminGetPatientOrderSentToHmo); // admin get patient order sent to hmo



// chats and messaging...
/* router.post("/chat_rooms/new", checkAdminRole, createChatRoom);
router.get("/chat_rooms", checkAdminRole, getChatRooms);
router.get("/chat_rooms/:room_id/chats", checkAdminRole, getChatsInRoom);
router.post("/chat_rooms/:room_id/new_message", checkAdminRole, sendChatToRoom);

 */


// Pharmacy requests creation and retrieval
router.get("/requests", checkAdminRole, getAllSentRequest);
router.post("/requests/:doctor_id/new", checkAdminRole, sendPharmacyRequest);
// mark pharmacy request as solved...
router.post("/requests/:request_id/solved", checkAdminRole, markPharmacyRequestAsSolved);

// doctor verification...
router.post("/:doctor_id/verify", checkAdminRole, verifyDoctorById);

// controller for general file uploads....
// router.post("/files/upload", checkAdminRole, uploadAnyFileToFirebase);



export default router;