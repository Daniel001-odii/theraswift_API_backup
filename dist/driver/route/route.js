"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upload_utility_1 = require("../../utils/upload.utility");
const deliver_controller_1 = require("../controllers/deliver.controller");
const emailPhoneNumberVerification_1 = require("../controllers/emailPhoneNumberVerification");
const forgotPassword_controller_1 = require("../controllers/forgotPassword.controller");
const regLogin_controller_1 = require("../controllers/regLogin.controller");
const requestValidate_middleware_1 = require("../middleware/requestValidate.middleware");
const roleChecker_middleware_1 = require("../middleware/roleChecker.middleware");
const express = require("express");
const router = express.Router();
router.post("/driver_signup", requestValidate_middleware_1.validateSignupParams, regLogin_controller_1.driverSignUpController); // driver signup
router.post("/driver_send_email", requestValidate_middleware_1.validateSendEmailParams, emailPhoneNumberVerification_1.driverSendEmailController); // driver send email
router.post("/driver_verify_email", requestValidate_middleware_1.validateVerifyEmailParams, emailPhoneNumberVerification_1.driverEmailVerificationController); // driver verified email
router.post("/driver_send_phonenumber", requestValidate_middleware_1.validateSendPhoneNumberParams, emailPhoneNumberVerification_1.driverSendPhoneNumberController); // driver send phone number
router.post("/driver_verify_phonenumber", requestValidate_middleware_1.validateVerifyPhoneNumberParams, emailPhoneNumberVerification_1.driverPhoneNumberVerificationController); // driver verified phone number
router.post("/driver_email_signin", requestValidate_middleware_1.validateEmailSignInParams, regLogin_controller_1.driverEmailSignInController); // driver sign in with email
router.post("/driver_phonenumber_signin", requestValidate_middleware_1.validatePhoneNumberSignInParams, regLogin_controller_1.driverMobileNumberSignInController); // driver sign in with phone number
router.post("/driver_email_forgot_password", requestValidate_middleware_1.validateSendEmailParams, forgotPassword_controller_1.driverEmailForgotPassworController); // driver email forgot password
router.post("/driver_email_reset_password", requestValidate_middleware_1.validateEmailResetPasswordParams, forgotPassword_controller_1.driverResetPassworController); // driver email reset password
router.post("/driver_phonenumber_forgot_password", requestValidate_middleware_1.validateSendPhoneNumberParams, forgotPassword_controller_1.driverMobileForgotPasswordController); // driver phone number forgot password
router.post("/driver_phonenumber_reset_password", requestValidate_middleware_1.validatePhoneNumberResetPasswordParams, forgotPassword_controller_1.driverMobileResetPasswordController); // driver phone number reset password
router.post("/driver_initiate_delivery", roleChecker_middleware_1.checkDriverRole, requestValidate_middleware_1.validateDriverInitiateDeliveryParams, deliver_controller_1.initateDeliveryGoodsController); // driver initiate delivery
router.post("/driver_pick_delivery_goods", roleChecker_middleware_1.checkDriverRole, requestValidate_middleware_1.validateDriverPickUpDeliveryGoodsParams, deliver_controller_1.pickDeliveryGoodsController); // driver pick up delivery goods
router.post("/driver_start_delivery_goods", roleChecker_middleware_1.checkDriverRole, requestValidate_middleware_1.validateDriverPickUpDeliveryGoodsParams, deliver_controller_1.startDeliveryGoodsController); // driver start delivery trip
router.post("/driver_deliver_goods_contact_customer", roleChecker_middleware_1.checkDriverRole, requestValidate_middleware_1.validateDeliveryIdParams, deliver_controller_1.contactDeliveryGoodsController); // driver deliver good to customer contact
router.post("/driver_deliver_goods_contactless_customer", roleChecker_middleware_1.checkDriverRole, upload_utility_1.upload.single('deliveryImg'), deliver_controller_1.contactlessDeliveryGoodsController); // driver deliver goods to customer contactless
router.post("/driver_phonenumber_reset_password", requestValidate_middleware_1.validateDeliveryIdParams, deliver_controller_1.customercomfirmDeliveryGoodsController); // customer comfirm delivery  goods
exports.default = router;
