import { upload } from "../../utils/upload.utility";
import { contactDeliveryGoodsController, contactlessDeliveryGoodsController, customercomfirmDeliveryGoodsController, initateDeliveryGoodsController, pickDeliveryGoodsController, startDeliveryGoodsController } from "../controllers/deliver.controller";
import { driverEmailVerificationController, driverPhoneNumberVerificationController, driverSendEmailController, driverSendPhoneNumberController } from "../controllers/emailPhoneNumberVerification";
import { driverEmailForgotPassworController, driverMobileForgotPasswordController, driverMobileResetPasswordController, driverResetPassworController } from "../controllers/forgotPassword.controller";
import { driverEmailSignInController, driverMobileNumberSignInController, driverSignUpController } from "../controllers/regLogin.controller";
import { validateDeliveryIdParams, validateDriverInitiateDeliveryParams, validateDriverPickUpDeliveryGoodsParams, validateEmailResetPasswordParams, validateEmailSignInParams, validatePhoneNumberResetPasswordParams, validatePhoneNumberSignInParams, validateSendEmailParams, validateSendPhoneNumberParams, validateSignupParams, validateVerifyEmailParams, validateVerifyPhoneNumberParams } from "../middleware/requestValidate.middleware";
import { checkDriverRole } from "../middleware/roleChecker.middleware";

const express = require("express");
const router = express.Router();


router.post("/driver_signup", validateSignupParams, driverSignUpController); // driver signup
router.post("/driver_send_email", validateSendEmailParams, driverSendEmailController); // driver send email
router.post("/driver_verify_email", validateVerifyEmailParams, driverEmailVerificationController); // driver verified email
router.post("/driver_send_phonenumber", validateSendPhoneNumberParams, driverSendPhoneNumberController); // driver send phone number
router.post("/driver_verify_phonenumber", validateVerifyPhoneNumberParams, driverPhoneNumberVerificationController); // driver verified phone number
router.post("/driver_email_signin", validateEmailSignInParams, driverEmailSignInController); // driver sign in with email
router.post("/driver_phonenumber_signin", validatePhoneNumberSignInParams, driverMobileNumberSignInController); // driver sign in with phone number
router.post("/driver_email_forgot_password", validateSendEmailParams, driverEmailForgotPassworController); // driver email forgot password
router.post("/driver_email_reset_password", validateEmailResetPasswordParams, driverResetPassworController); // driver email reset password
router.post("/driver_phonenumber_forgot_password", validateSendPhoneNumberParams, driverMobileForgotPasswordController); // driver phone number forgot password
router.post("/driver_phonenumber_reset_password", validatePhoneNumberResetPasswordParams, driverMobileResetPasswordController); // driver phone number reset password

router.post("/driver_initiate_delivery", checkDriverRole, validateDriverInitiateDeliveryParams, initateDeliveryGoodsController); // driver initiate delivery
router.post("/driver_pick_delivery_goods", checkDriverRole, validateDriverPickUpDeliveryGoodsParams, pickDeliveryGoodsController); // driver pick up delivery goods
router.post("/driver_start_delivery_goods", checkDriverRole, validateDriverPickUpDeliveryGoodsParams, startDeliveryGoodsController); // driver start delivery trip
router.post("/driver_deliver_goods_contact_customer", checkDriverRole, validateDeliveryIdParams, contactDeliveryGoodsController); // driver deliver good to customer contact
router.post("/driver_deliver_goods_contactless_customer", checkDriverRole, upload.single('deliveryImg'), contactlessDeliveryGoodsController); // driver deliver goods to customer contactless
router.post("/driver_phonenumber_reset_password", validateDeliveryIdParams, customercomfirmDeliveryGoodsController); // customer comfirm delivery  goods


export default router;