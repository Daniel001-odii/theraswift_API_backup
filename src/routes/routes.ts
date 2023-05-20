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
  addFamilyController,
  getUserFamilyController,
  deleteUserFamilyController,
  addHmoController,
  getHMOByIdController,
  getAllHMOController,
  getUserHMOsController,
  deleteUserHMOByIdController,
  uncompletedOrdersControllers,
  addShippingAddressController,
  getUserShippingAddressController,
  getUserShippingAddressByIdController,
  getUsersController,
  getChatsController,
  createCareerOpening,
  getCareerOpenings,
} from "../controllers/";
import { validateLoginParams } from "../middleware/login.middleware";
import { checkAdminRole, checkRole } from "../middleware/roleCheck.middleware";
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
router.post("/topup_wallet", checkRole, topUpWalletController);
router.post("/gift_wallet_topup", checkRole, giftWalletTopUpController);
router.post("/new_order", checkRole, multerUpload.single("image"), addOrder);
router.get("/get_order_by_id", checkRole, getOrderById);
router.get("/get_orders", checkRole, getOrders);
router.get("/get_user_orders", checkRole, getUserOrders);
router.put("/update_order_status", checkAdminRole, updateOrderStatus);
router.post(
  "/send_prescription",
  checkRole,
  multerUpload.single("image"),
  addPrescription
);
router.get("/get_prescription_by_id", checkRole, getPrescriptionById);
router.get("/get_user_prescriptions", checkRole, getUserPrescription);
router.post("/delete_user_prescription", checkRole, deleteUserPrescriptionById);
router.get("/get_all_prescriptions", checkRole, getPrescriptions);
router.get("/get_user_transactions", checkRole, getUserTransactions);
router.post("/otp/send_password_recovery_email", emailOtpRequestController);
router.post("/otp/send_password_recovery_sms", smsOtpRequestController);
router.post("/otp/verify_password_recovery_otp", smsOtpRequestController);
router.post("/otp/update_password", updatePasswordController);
router.post("/send_sms", sendSmsController);
router.post("/add_family", checkRole, addFamilyController);
router.post("/get_user_family", checkRole, getUserFamilyController);
router.post("/delete_user_family", checkRole, deleteUserFamilyController);
router.post(
  "/add_hmo",
  checkRole,
  multerUpload.single("image"),
  addHmoController
);
router.post("/get_hmo_by_id", checkRole, getHMOByIdController);
router.post("/get_user_hmo", checkRole, getUserHMOsController);
router.post("/get_all_hmo", checkRole, getAllHMOController);
router.post("/delete_user_hmo", checkRole, deleteUserHMOByIdController);
router.post("/complete_order", checkRole, uncompletedOrdersControllers);
router.post("/add_shipping_address", checkRole, addShippingAddressController);
router.post(
  "/get_user_shipping_address",
  checkRole,
  getUserShippingAddressController
);
router.post(
  "/get_user_shipping_address_by_id",
  checkRole,
  getUserShippingAddressByIdController
);
// router.get("/get_chats", getChatsController);
// // router.post('/add_chats', addChatsController)
router.get("get_users", checkRole, getUsersController);
router.post(
  "/add_career_openings",
  checkAdminRole,
  checkAdminRole,
  createCareerOpening
);
router.get("/get_career_openings", checkRole, getCareerOpenings);

export default router;
