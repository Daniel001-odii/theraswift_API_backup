const express = require("express");

const router = express.Router();
import {
  signUpController,
  loginController,
  rootController,
} from "../controllers/";
import { resendEmailController, sendEmailController, verifyEmailController } from "../controllers/emailOtp.controller";
import { mobileOtpController, mobileOtpResendController, mobileOtpVerificationController } from "../controllers/mobileOtp.controller";
import { validateLoginParams } from "../middleware/login.middleware";
import { validateSignupParams } from "../middleware/signup.middleware";

// theraswift routes
router.get("/", rootController);
router.post("/signup", validateSignupParams, signUpController);
router.post("/login",validateLoginParams, loginController);
router.post("/otp/send_mobile", mobileOtpController);
router.post("/otp/verify_mobile", mobileOtpVerificationController);
router.post("/otp/resend_mobile", mobileOtpResendController);
router.post("/otp/send_email", sendEmailController);
router.post("/otp/verify_email", verifyEmailController);
router.post("/otp/resend_email", resendEmailController);
// router.delete("/deleteTodo", deleteTodo);

export default router;
