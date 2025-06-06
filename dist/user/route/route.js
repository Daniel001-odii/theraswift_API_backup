"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const requestValidate_middleware_1 = require("../middlewares/requestValidate.middleware");
const regLogin_controller_1 = require("../controllers/regLogin.controller");
const emailVerification_controller_1 = require("../controllers/emailVerification.controller");
const phoneNumberVerification_controller_1 = require("../controllers/phoneNumberVerification.controller");
const forgotResetPassword_controller_1 = require("../controllers/forgotResetPassword.controller");
const roleChecker_middleware_1 = require("../middlewares/roleChecker.middleware");
const medication_controller_1 = require("../controllers/medication.controller");
const upload_utility_1 = require("../../utils/upload.utility");
const cart_controlller_1 = require("../controllers/cart.controlller");
const checkOut_controller_1 = require("../controllers/checkOut.controller");
const essentialProduct_category_1 = require("../controllers/essentialProduct.category");
const essentialProductCart_controller_1 = require("../controllers/essentialProductCart.controller");
// import { userCheckOutEssentialPRoductController } from "../controllers/checkOutEssential.Controller";
const newletter_controller_1 = require("../controllers/newletter.controller");
const userDeleteMyAccount_controller_1 = require("../controllers/userDeleteMyAccount.controller");
// Daniels code here...
const userDeleteMyAccount_controller_2 = require("../controllers/userDeleteMyAccount.controller");
const userDeleteMyAccount_controller_3 = require("../controllers/userDeleteMyAccount.controller");
const phoneNumberVerification_controller_2 = require("../controllers/phoneNumberVerification.controller");
const userProfile_controller_1 = require("../controllers/userProfile.controller");
router.post("/check_email", requestValidate_middleware_1.validateEmailParams, regLogin_controller_1.userCheckEmailController); // user check email
router.post("/check_delivery_state", requestValidate_middleware_1.validateDeliveryStateParams, regLogin_controller_1.userCheckStateController); // user check email
router.post("/user_signup", requestValidate_middleware_1.validateSignupParams, regLogin_controller_1.userSignUpController); // user signup
router.post("/user_send_email", requestValidate_middleware_1.validateEmailParams, emailVerification_controller_1.userSendEmailController); // user send email
router.post("/user_resend_email", requestValidate_middleware_1.validateEmailParams, emailVerification_controller_1.userSendEmailController); // user resend email
router.post("/user_email_verification", requestValidate_middleware_1.validateEmailVerificatioParams, emailVerification_controller_1.userEmailVerificationController); // user email verification
router.post("/user_verify_email", requestValidate_middleware_1.validateEmailVerificatioParams, emailVerification_controller_1.userVerifyEmail);
router.post("/user_send_number", requestValidate_middleware_1.validatePhoneNumberParams, phoneNumberVerification_controller_2.userSendPhoneNumberController); // user send phone number
router.post("/user_resend_number", requestValidate_middleware_1.validatePhoneNumberParams, phoneNumberVerification_controller_2.userSendPhoneNumberController); // user resend phone number
router.post("/user_number_verification", requestValidate_middleware_1.validatePhoneNumberVerificatioParams, phoneNumberVerification_controller_1.userPhoneNumberVerificationController); // user phone number verification
router.post("/forgot_password_email", requestValidate_middleware_1.validateEmailParams, forgotResetPassword_controller_1.userEmailForgotPasswordController); // user forgot password with email
router.post("/reset_password_email", requestValidate_middleware_1.validateEmailResetPasswordParams, forgotResetPassword_controller_1.userEmailResetPasswordController); // user reset password with email
router.post("/forgot_password_mobile", requestValidate_middleware_1.validatePhoneNumberParams, forgotResetPassword_controller_1.userMobileForgotPasswordController); // user forgot password with mobile number
router.post("/reset_password_mobile", requestValidate_middleware_1.validatePhoneNumberResetPasswordParams, forgotResetPassword_controller_1.userMobileResetPasswordController); // user reset password with mobile number
router.post("/email_login", requestValidate_middleware_1.validateEmailLoginParams, regLogin_controller_1.userEmailSignInController); // user login with email
router.post("/mobile_login", requestValidate_middleware_1.validatePhoneLoginParams, regLogin_controller_1.userMobileNumberSignInController); // user login  with mobile number 
router.get("/user_detail", roleChecker_middleware_1.checkUserRole, regLogin_controller_1.userdetailController); // get login user detail
router.post("/family_member", requestValidate_middleware_1.validatefamilymemberParams, roleChecker_middleware_1.checkUserRole, regLogin_controller_1.userRegistMemberController); // regiter fimily member
router.get("/family_detail", roleChecker_middleware_1.checkUserRole, regLogin_controller_1.userGetMemberController); // get family member detail
router.post("/new_address", requestValidate_middleware_1.validateAddressParams, roleChecker_middleware_1.checkUserRole, regLogin_controller_1.userAddAddressController); // enter new adress
router.get("/addresss_detail", roleChecker_middleware_1.checkUserRole, regLogin_controller_1.userGetAddressController); // get address detail
router.post("/add_hmo", upload_utility_1.upload.single('hmoImg'), roleChecker_middleware_1.checkUserRole, regLogin_controller_1.userAddHmoController); // user add hmo
router.get("/hmo_detail", roleChecker_middleware_1.checkUserRole, regLogin_controller_1.userGetHmoController); // get hmo detail
router.get("/get_meidcatiom", medication_controller_1.userGethMedicationController); // get medication
router.get("/get_medication_by_id", requestValidate_middleware_1.validateGetMedicationByIdParams, medication_controller_1.userGethMedicationByIdController); // get medication by Id
router.get("/get_popular_medication", medication_controller_1.userGetPopualarMedicationController); // get popular medicatiom
router.post("/add_medication", requestValidate_middleware_1.validateUserAddMedicationParams, roleChecker_middleware_1.checkUserRole, medication_controller_1.userAddMedicationController); // user add medication
router.post("/remove_medication", requestValidate_middleware_1.validateRemovedMedicationParams, roleChecker_middleware_1.checkUserRole, medication_controller_1.userRemoveMedicationController); // user remove medication
router.get("/seach_medication", medication_controller_1.userSearchMedicationController); // user search for medication
router.get("/seach_medication_name", requestValidate_middleware_1.validateSearchMedicationByNameParams, medication_controller_1.userSearchMedicationNameController); // user search for medication by name
router.get("/seach_medication_name_form", requestValidate_middleware_1.validateSearchMedicationByNameFRomParams, medication_controller_1.userSearchMedicationNameFormController); // user search for medication by name and form
router.get("/seach_medication_name_form_dosage", requestValidate_middleware_1.validateSearchMedicationByNameFRomDosageParams, medication_controller_1.userSearchMedicationNameFormDosageController); // user search for medication by name, form and dosage
router.get("/get_user_medication", roleChecker_middleware_1.checkUserRole, medication_controller_1.userGetMedicationController); // get all medication for specific user
router.post("/add_prescription_image", upload_utility_1.upload.single('prescription'), roleChecker_middleware_1.checkUserRole, medication_controller_1.userAddPrescriptionImageController); // user add priscription image
router.get("/check_user_prescription_status", roleChecker_middleware_1.checkUserRole, medication_controller_1.userPrescriptionStatusController); // check user prescription for medication
router.get("/get_user_medication_require_prescription", roleChecker_middleware_1.checkUserRole, medication_controller_1.userMedicatonRequiredPrescriptionController); // get user medication that required prescrition
router.post("/add_medication_by_img", upload_utility_1.upload.single('prescription'), roleChecker_middleware_1.checkUserRole, medication_controller_1.userAddMedicationThroughImageController); // user add medication by image
router.post("/add_to_cart", requestValidate_middleware_1.validateAddMedicationParams, roleChecker_middleware_1.checkUserRole, cart_controlller_1.userAddMedicationToCartController); // user add medication to cartlist
router.post("/increase_from_cart", requestValidate_middleware_1.validateUserCartParams, roleChecker_middleware_1.checkUserRole, cart_controlller_1.userIncreaseMedicationToCartController); // user increase medication from cart list
router.post("/decrease_from_cart", requestValidate_middleware_1.validateUserCartParams, roleChecker_middleware_1.checkUserRole, cart_controlller_1.userDecreaseMedicationToCartController); // user decrease medication in cart list
router.post("/remove_from_cart", requestValidate_middleware_1.validateUserCartParams, roleChecker_middleware_1.checkUserRole, cart_controlller_1.userRemoveMedicationToCartController); // user remove medication from cart list
router.get("/user_cart", roleChecker_middleware_1.checkUserRole, cart_controlller_1.userCartListController); // user get all cart list
router.get("/cart_refill_status", requestValidate_middleware_1.validateUserCartQueryParams, roleChecker_middleware_1.checkUserRole, cart_controlller_1.userRefillStatusCartController); // change medication refill in cart
router.post("/clear_cart", roleChecker_middleware_1.checkUserRole, cart_controlller_1.userClearCartlistController); // user clear cart list
router.post("/checkout", requestValidate_middleware_1.validateUserCheckOutParams, roleChecker_middleware_1.checkUserRole, checkOut_controller_1.userCheckOutController); //  user checkout
router.post("/direct_checkout", requestValidate_middleware_1.validateUserCheckOutDirectParams, roleChecker_middleware_1.checkUserRole, checkOut_controller_1.userCheckOutFromAvailableMedController); //  user checkout direct
router.post("/checkout/verification", requestValidate_middleware_1.validateUserCheckOutVerificationParams, roleChecker_middleware_1.checkUserRole, checkOut_controller_1.userCheckOutPaymentVerificationController); //  user checkout
router.get("/pending_order", roleChecker_middleware_1.checkUserRole, checkOut_controller_1.userGetPendingOrderController); // pending order
router.get("/not_delevered_order", roleChecker_middleware_1.checkUserRole, checkOut_controller_1.userGetNotDeliveredOrderController); // not delivered order
router.get("/delivered_order", roleChecker_middleware_1.checkUserRole, checkOut_controller_1.userGetDeliveredOrderController); //  delivered order
router.get("/ensentialCategory", roleChecker_middleware_1.checkUserRole, essentialProduct_category_1.getPageEssentialCategoryController); // list enssentail categories
router.get("/ensentialProduct", roleChecker_middleware_1.checkUserRole, essentialProduct_category_1.getEssentialProductBycategoryController); // list enssentail product unde categories
router.post("/ensentialProduct_add_cart", requestValidate_middleware_1.validateEnssntialCarttParams, roleChecker_middleware_1.checkUserRole, essentialProductCart_controller_1.addEssentialProductToCartController); // add product to cart
// router.post("/ensentialProduct_cart_increase", validateEnssntialcartIDtParams, checkUserRole, increaseEssentialProductToCartController ); // increase product in cart
// router.post("/ensentialProduct_cart_decrease", validateEnssntialcartIDtParams, checkUserRole, decreaseEssentialProductToCartController ); // decrease product in cart
// router.get("/ensentialProduct_cart_list", checkUserRole, getEssentialProductInCartController ); // get user cart list
// router.post("/checkout_enssential_product", checkUserRole, userCheckOutEssentialPRoductController ); // user checkout cart list
router.post("/subcribe_for_newsletter", requestValidate_middleware_1.validateEmailParams, newletter_controller_1.subcribForNewsletterController); // user subcribe for newsletter
router.get("/frquence_ask_ans", newletter_controller_1.frequenceAskQuestionController); // user subcribe for newsletter
//delete user acccount
router.delete("/delete_my_account", roleChecker_middleware_1.checkUserRole, userDeleteMyAccount_controller_1.userDeleteMyAccountController); //  user delete data from database
router.post("/account/delete_request", userDeleteMyAccount_controller_2.sendDeleteOTP);
router.post("/account/delete_confirm", userDeleteMyAccount_controller_3.deleteAccountWithOTP);
//editing user profile [NEW ENDPOINTS]
router.patch("/account/profile_edit", roleChecker_middleware_1.checkUserRole, userProfile_controller_1.editUserprofile);
// chats and messaging...
/* router.post("/chat_rooms/doctor/new", checkUserRole, createChatRoomForDoctor);
router.post("/chat_rooms/pharmacy/new", checkUserRole, createChatRoomForPharmacy);
router.get("/chat_rooms", checkUserRole, getChatRooms);
router.get("/chat_rooms/:room_id/chats", checkUserRole, getChatMessagesInRoom);
router.post("/chat_rooms/:room_id/new_message", checkUserRole, sendChatToRoom);

 */
exports.default = router;
