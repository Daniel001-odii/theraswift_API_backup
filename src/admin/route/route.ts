const express = require("express");
const router = express.Router();
import { 
    validatDoctorIdParams,
    validatEssentialCategoryParams,
    validatEssentialProuctIdParams,
    validatFrequenceAskParams,
    validatHmoIdParams,
    validatPatientUnderDoctorIdParams,
    validatSinglePatientUnderDoctorIdParams,
    validateAdminGettOrderToHmoParams,
    validateAdminSentOrderToHmoParams,
    validateAdminSigninParams,
    validateAdminSigninPhonNumberParams,
    validateDoctorEmailParams,
    validateEmail,
    validateMedicationDeleteParams,
    validateMedicationEditParams,
    validateOrderParams,
    validatePhonNumber,
    validateResetPassword,
    validateResetPasswordByPhoneNumber,
    validateSendEmailigninParams,
    validateSendPhoneNumberParams,
    validateSignupParams,
    validateUserParams,
    validateVerifyEmailEmailigninParams,
    validateVerifyPhoneNumbweParams
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
import { createEssentialCategoryController, getAllEssentialCategoryController, getPageEssentialCategoryController } from "../controllers/essentialCategory.controller";
import { adminAddEssentialProductController, deleteEssentialProductController, editEssentialProductController, getPageEssentialProductController, searchEssentialProductByNameController } from "../controllers/essentialProduct.controller";
import { adminEmailVerificationController, adminPhoneNumberVerificationController, adminSendEmailController, adminSendPhoneNumberController } from "../controllers/emailPhoneNumberVerification";
import { adminFrequenceAskController, adminNewsletterSubcriberController } from "../controllers/frequencAskAndNewsletter.controller";
import { adminGetDoctor, adminGetPatientUnderDoctor, adminGetSingleDoctorOder, adminGetSinglePatientUnderDoctorOder, adminGiveDoctorClinicCode } from "../controllers/doctorDetail.controller";
import { adminGetDoctorDeliveredPatientOrder, adminGetDoctorPatientProgressOrder, adminGetDoctorPendingPatientOrder, adminGetDoctorSingleDeliveredPatientOrder, adminGetDoctorSinglePendingPatientOrder, adminGetDoctorSingleProgressPatientOrder } from "../controllers/doctorPatientPrescription.controller";
import { adminGetHmo, adminGetSingleHmo } from "../controllers/hmoDetail.controller";
import { adminGetPatientOrderSentToHmo, adminSendingPatientOrderToHmo } from "../controllers/sendOrderToHmo.controller";


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


router.post("/admin_add_medication", checkAdminRole, upload.single('medicationImg'), adminAddMedicationController); // admin add medication to databas
router.post("/admin_edit_medication", validateMedicationEditParams, checkAdminRole,   adminEditMedicationController); // admin add medication to databas
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
router.post("/delivered_order", validateOrderParams, checkAdminRole, DeliveredOrderController); //  delivered order

//essential
router.post("/create_category", checkAdminRole, upload.single('categoryImg'), createEssentialCategoryController); //  create essential category
router.get("/get_category", checkAdminRole, getAllEssentialCategoryController); // get essential category
router.get("/get_page_category", checkAdminRole, getPageEssentialCategoryController); // get essential category
router.post("/create_product",  checkAdminRole, upload.single('productImg'), adminAddEssentialProductController); // create essential product
router.get("/get_product",  checkAdminRole, getPageEssentialProductController); // get essential page product
router.get("/search_product_name",  checkAdminRole, searchEssentialProductByNameController); // get essential product by name
router.post("/edit_product",  checkAdminRole, upload.single('productImg'),  editEssentialProductController); // get essential product by name
router.post("/delete_product", validatEssentialProuctIdParams,  checkAdminRole, deleteEssentialProductController); // get essential product by name


router.post("/frequence_ask", validatFrequenceAskParams,  checkAdminRole, adminFrequenceAskController); // add question and answe
router.get("/get_newsletters",  checkAdminRole, adminNewsletterSubcriberController); // get newslw=etter subscriber




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

router.post("/generate_clinic_code", validateDoctorEmailParams, checkAdminRole, adminGiveDoctorClinicCode); // admin generate clinic code for doctor

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








export default router;