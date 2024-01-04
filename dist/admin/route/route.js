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
const orderFromDoctor_controller_1 = require("../controllers/orderFromDoctor.controller");
const essentialCategory_controller_1 = require("../controllers/essentialCategory.controller");
const essentialProduct_controller_1 = require("../controllers/essentialProduct.controller");
const emailPhoneNumberVerification_1 = require("../controllers/emailPhoneNumberVerification");
const frequencAskAndNewsletter_controller_1 = require("../controllers/frequencAskAndNewsletter.controller");
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
router.post("/admin_add_medication", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('medicationImg'), medication_controller_1.adminAddMedicationController); // admin add medication to databas
router.post("/admin_edit_medication", requestValidate_middleware_1.validateMedicationEditParams, rolechecker_middleware_1.checkAdminRole, medication_controller_1.adminEditMedicationController); // admin add medication to databas
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
router.post("/delivered_order", requestValidate_middleware_1.validateOrderParams, rolechecker_middleware_1.checkAdminRole, order_controller_1.DeliveredOrderController); //  delivered order
//essential
router.post("/create_category", upload_utility_1.upload.single('categoryImg'), rolechecker_middleware_1.checkAdminRole, essentialCategory_controller_1.createEssentialCategoryController); //  create essential category
router.get("/get_category", rolechecker_middleware_1.checkAdminRole, essentialCategory_controller_1.getAllEssentialCategoryController); // get essential category
router.get("/get_page_category", rolechecker_middleware_1.checkAdminRole, essentialCategory_controller_1.getPageEssentialCategoryController); // get essential category
router.post("/create_product", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('productImg'), essentialProduct_controller_1.adminAddEssentialProductController); // create essential product
router.get("/get_product", rolechecker_middleware_1.checkAdminRole, essentialProduct_controller_1.getPageEssentialProductController); // get essential page product
router.get("/search_product_name", rolechecker_middleware_1.checkAdminRole, essentialProduct_controller_1.searchEssentialProductByNameController); // get essential product by name
router.post("/edit_product", rolechecker_middleware_1.checkAdminRole, upload_utility_1.upload.single('productImg'), essentialProduct_controller_1.editEssentialProductController); // get essential product by name
router.post("/delete_product", requestValidate_middleware_1.validatEssentialProuctIdParams, rolechecker_middleware_1.checkAdminRole, essentialProduct_controller_1.deleteEssentialProductController); // get essential product by name
router.post("/frequence_ask", requestValidate_middleware_1.validatFrequenceAskParams, rolechecker_middleware_1.checkAdminRole, frequencAskAndNewsletter_controller_1.adminFrequenceAskController); // add question and answe
router.get("/get_newsletters", rolechecker_middleware_1.checkAdminRole, frequencAskAndNewsletter_controller_1.adminNewsletterSubcriberController); // get newslw=etter subscriber
/////////////////////////////////
//////// doctor ///////////////
/////////////////////////////
router.get("/doctor_order_pending", rolechecker_middleware_1.checkAdminRole, orderFromDoctor_controller_1.adminGetPendingDoctorOder); // get order from doctor that is pending
router.get("/doctor_order_paid", rolechecker_middleware_1.checkAdminRole, orderFromDoctor_controller_1.adminGetPaidDoctorOder); // get order from doctor that is paid
router.get("/doctor_order_delivered", rolechecker_middleware_1.checkAdminRole, orderFromDoctor_controller_1.adminGetDeliverdDoctorOder); // get order from doctor that is delived
exports.default = router;
