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
  addMedicationController
} from "../controllers/";
import { editMedicationController } from "../controllers/medication.controller";
import { validateLoginParams } from "../middleware/login.middleware";
import { checkAdminRole } from "../middleware/roleCkeck.middleware";
import { validateSignupParams } from "../middleware/signup.middleware";

// theraswift routes
router.get("/", rootController);
router.post("/signup", validateSignupParams, signUpController);
router.post("/login", validateLoginParams, loginController);
router.post("/otp/send_mobile", mobileOtpController);
router.post("/otp/verify_mobile", mobileOtpVerificationController);
router.post("/otp/resend_mobile", mobileOtpResendController);
router.put("/topUpWallet", topUpWalletController);
router.put("/giftWalletTopUp", giftWalletTopUpController);
router.post("/otp/send_email", sendEmailController);
router.post("/otp/verify_email", verifyEmailController);
router.post("/otp/resend_email", resendEmailController);
router.post("/add_medication",checkAdminRole, addMedicationController);
router.post("/edit_medication",checkAdminRole, editMedicationController);

// router.delete("/deleteTodo", deleteTodo);

export default router;
