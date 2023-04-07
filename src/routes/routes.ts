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
  getPrescriptions,
  getPrescriptionById,
  getUserPrescription,
  getOrderById,
  getOrders,
  getUserOrders,
  getUserTransactions,
  updateOrderStatus,
  deleteUserPrescriptionById,
  emailOtpRequestController,
  smsOtpRequestController,
  updatePasswordController,
  sendSmsController,
} from "../controllers/";
import { validateLoginParams } from "../middleware/login.middleware";
import { checkAdminRole } from "../middleware/roleCheck.middleware";
import { validateSignupParams } from "../middleware/signup.middleware";
import { multerUpload } from "../middleware/multer.middleware";

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
router.post(
  "/add_medication",
  checkAdminRole,
  multerUpload.single("image"),
  addMedicationController
);
router.put("/update_medication", checkAdminRole, editMedicationController);
router.post("/topup_wallet", topUpWalletController);
router.post("/gift_wallet_topup", giftWalletTopUpController);
router.post("/new_order", addOrder);
router.get("/get_order_by_id", getOrderById);
router.get("/get_orders", getOrders);
router.get("/get_user_orders", getUserOrders);
router.put("/update_order_status", checkAdminRole, updateOrderStatus);
router.post("/add_prescription", multerUpload.single("image"), addPrescription);
router.get("/get_prescription_by_id", getPrescriptionById);
router.get("/get_user_prescriptions", getUserPrescription);
router.post("/delete_user_prescription", deleteUserPrescriptionById);
router.get("/get_all_prescriptions", getPrescriptions);
router.get("/get_user_transactions", getUserTransactions);
router.post("/otp/send_password_recovery_email", emailOtpRequestController);
router.post("/otp/send_password_recovery_sms", smsOtpRequestController);
router.post("/otp/verify_password_recovery_otp", smsOtpRequestController);
router.post("/otp/update_password", updatePasswordController);
router.post("/send_sms", sendSmsController);

export default router;
