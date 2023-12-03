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
router.post("/admin_signin", requestValidate_middleware_1.validateAdminSigninParams, regLogin_controller_1.adminSignInController); // admin login
router.post("/admin_forgot_password", requestValidate_middleware_1.validateEmail, forgotPassword_controller_1.adminForgotPassworController); // admin forgot password
router.post("/admin_reset_password", requestValidate_middleware_1.validateResetPassword, forgotPassword_controller_1.adminResetPassworController); // admin reset password
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
/////////////////////////////////
//////// doctor ///////////////
/////////////////////////////
router.get("/doctor_order_pending", rolechecker_middleware_1.checkAdminRole, orderFromDoctor_controller_1.adminGetPendingDoctorOder); // get order from doctor that is pending
router.get("/doctor_order_paid", rolechecker_middleware_1.checkAdminRole, orderFromDoctor_controller_1.adminGetPaidDoctorOder); // get order from doctor that is paid
router.get("/doctor_order_delivered", rolechecker_middleware_1.checkAdminRole, orderFromDoctor_controller_1.adminGetDeliverdDoctorOder); // get order from doctor that is delived
exports.default = router;
