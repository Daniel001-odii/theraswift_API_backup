const express = require("express");

const router = express.Router();
import {
  signUpController,
  loginController,
  rootController,
  topUpWalletController,
  giftWalletTopUpController,
  mobileOtpController,
  mobileOtpResendController,
  mobileOtpVerificationController,
  resendEmailController,
  sendEmailController,
  verifyEmailController,
  addMedicationController,
  editMedicationController,
  addOrder,
  addPrescription,
  getPrescription
} from "../controllers/";
import { validateLoginParams } from "../middleware/login.middleware";
import { checkAdminRole } from "../middleware/roleCheck.middleware";
import { validateSignupParams } from "../middleware/signup.middleware";

// theraswift routes
router.get("/", rootController);
router.post("/signup", validateSignupParams, signUpController);
router.post("/login", validateLoginParams, loginController);
router.post("/otp/send_mobile", mobileOtpController);
router.post("/otp/verify_mobile", mobileOtpVerificationController);
router.post("/otp/resend_mobile", mobileOtpResendController);
router.post("/otp/send_email", sendEmailController);
router.post("/otp/verify_email", verifyEmailController);
router.post("/otp/resend_email", resendEmailController);
router.post("/add_medication",checkAdminRole, addMedicationController);
router.post("/edit_medication",checkAdminRole, editMedicationController);
router.post("/order_medication",editMedicationController);
router.post("/topup_wallet", topUpWalletController);
router.post("/gift_wallet_topup", giftWalletTopUpController);
router.post("/new_order", addOrder);
router.post("/add_prescription",addPrescription)
router.post("/get_prescription",getPrescription)
// router.delete("/deleteTodo", deleteTodo);

export default router;
