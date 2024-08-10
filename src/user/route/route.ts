const express = require("express");
const router = express.Router();

import { 
    validateSignupParams,
    validateEmailParams,
    validateEmailVerificatioParams,
    validatePhoneNumberVerificatioParams,
    validatePhoneNumberParams,
    validateEmailResetPasswordParams,
    validatePhoneNumberResetPasswordParams,
    validateEmailLoginParams,
    validatePhoneLoginParams,
    validateAddMedicationParams,
    validateUserAddMedicationParams,
    validateSearchMedicationByNameParams,
    validateSearchMedicationByNameFRomParams,
    validateSearchMedicationByNameFRomDosageParams,
    validateUserCartParams,
    validateUserCheckOutParams,
    validateUserCheckOutVerificationParams,
    validatefamilymemberParams,
    validateAddressParams,
    validateDeliveryStateParams,
    validateEnssntialProoudtParams,
    validateEnssntialCarttParams,
    validateEnssntialcartIDtParams,
    validateGetMedicationByIdParams,
    validateUserCartQueryParams,
    validateUserCheckOutDirectParams,
    validateRemovedMedicationParams
} from "../middlewares/requestValidate.middleware";
import { 
    userAddAddressController,
     userAddHmoController,
     userCheckEmailController,
     userCheckStateController,
     userEmailSignInController,
     userGetAddressController, userGetHmoController, userGetMemberController, userMobileNumberSignInController, userRegistMemberController, userSignUpController, userdetailController } from "../controllers/regLogin.controller";
import { userSendEmailController, userEmailVerificationController } from "../controllers/emailVerification.controller";
import { userPhoneNumberVerificationController, userSendPhoneNumberController } from "../controllers/phoneNumberVerification.controller";
import { userEmailForgotPasswordController, userEmailResetPasswordController, userMobileForgotPasswordController, userMobileResetPasswordController } from "../controllers/forgotResetPassword.controller";
import { checkUserRole } from "../middlewares/roleChecker.middleware";
import { 
    userAddMedicationController, 
    userAddMedicationThroughImageController, 
    userAddPrescriptionImageController, 
    userGetMedicationController,   
    userGetPopualarMedicationController,   
    userGethMedicationByIdController,   
    userGethMedicationController,   
    userMedicatonRequiredPrescriptionController,   
    userPrescriptionStatusController,   
    userRemoveMedicationController, 
    userSearchMedicationController, 
    userSearchMedicationNameController,
    userSearchMedicationNameFormController,
    userSearchMedicationNameFormDosageController
} from "../controllers/medication.controller";
import { upload } from "../../utils/upload.utility";
import { userAddMedicationToCartController, userCartListController, userClearCartlistController, userDecreaseMedicationToCartController, userIncreaseMedicationToCartController, userRefillStatusCartController, userRemoveMedicationToCartController } from "../controllers/cart.controlller";
import { userCheckOutController, userCheckOutFromAvailableMedController, userCheckOutPaymentVerificationController, userGetDeliveredOrderController, userGetNotDeliveredOrderController, userGetPendingOrderController } from "../controllers/checkOut.controller";
import { getEssentialProductBycategoryController, getPageEssentialCategoryController } from "../controllers/essentialProduct.category";
import { addEssentialProductToCartController, decreaseEssentialProductToCartController, getEssentialProductInCartController, increaseEssentialProductToCartController } from "../controllers/essentialProductCart.controller";
// import { userCheckOutEssentialPRoductController } from "../controllers/checkOutEssential.Controller";
import { frequenceAskQuestionController, subcribForNewsletterController } from "../controllers/newletter.controller";
import { userDeleteMyAccountController } from "../controllers/userDeleteMyAccount.controller";


// Daniels code here.....
import { sendDeleteOTP } from "../controllers/userDeleteMyAccount.controller";
import { deleteAccountWithOTP } from "../controllers/userDeleteMyAccount.controller";

router.post("/check_email", validateEmailParams, userCheckEmailController ); // user check email
router.post("/check_delivery_state", validateDeliveryStateParams, userCheckStateController ); // user check email
router.post("/user_signup", validateSignupParams, userSignUpController ); // user signup
router.post("/user_send_email", validateEmailParams, userSendEmailController ); // user send email
router.post("/user_resend_email", validateEmailParams, userSendEmailController ); // user resend email
router.post("/user_email_verification", validateEmailVerificatioParams, userEmailVerificationController  ); // user email verification
router.post("/user_send_number", validatePhoneNumberParams, userSendPhoneNumberController ); // user send phone number
router.post("/user_resend_number", validatePhoneNumberParams, userSendPhoneNumberController ); // user resend phone number
router.post("/user_number_verification", validatePhoneNumberVerificatioParams, userPhoneNumberVerificationController  ); // user phone number verification
router.post("/forgot_password_email", validateEmailParams, userEmailForgotPasswordController ); // user forgot password with email
router.post("/reset_password_email", validateEmailResetPasswordParams, userEmailResetPasswordController ); // user reset password with email
router.post("/forgot_password_mobile", validatePhoneNumberParams, userMobileForgotPasswordController ); // user forgot password with mobile number
router.post("/reset_password_mobile", validatePhoneNumberResetPasswordParams, userMobileResetPasswordController); // user reset password with mobile number
router.post("/email_login", validateEmailLoginParams, userEmailSignInController ); // user login with email
router.post("/mobile_login", validatePhoneLoginParams, userMobileNumberSignInController ); // user login  with mobile number 
router.get("/user_detail", checkUserRole, userdetailController ); // get login user detail
router.post("/family_member", validatefamilymemberParams, checkUserRole, userRegistMemberController ); // regiter fimily member
router.get("/family_detail", checkUserRole, userGetMemberController ); // get family member detail
router.post("/new_address", validateAddressParams, checkUserRole, userAddAddressController ); // enter new adress
router.get("/addresss_detail", checkUserRole, userGetAddressController ); // get address detail
router.post("/add_hmo", upload.single('hmoImg'), checkUserRole, userAddHmoController ); // user add hmo
router.get("/hmo_detail", checkUserRole, userGetHmoController ); // get hmo detail


router.get("/get_meidcatiom", userGethMedicationController ); // get medication
router.get("/get_medication_by_id", validateGetMedicationByIdParams,  userGethMedicationByIdController ); // get medication by Id
router.get("/get_popular_medication", userGetPopualarMedicationController ); // get popular medicatiom
router.post("/add_medication", validateUserAddMedicationParams, checkUserRole,   userAddMedicationController ); // user add medication
router.post("/remove_medication", validateRemovedMedicationParams, checkUserRole, userRemoveMedicationController ); // user remove medication
router.get("/seach_medication",  userSearchMedicationController ); // user search for medication
router.get("/seach_medication_name", validateSearchMedicationByNameParams,  userSearchMedicationNameController ); // user search for medication by name
router.get("/seach_medication_name_form", validateSearchMedicationByNameFRomParams, userSearchMedicationNameFormController ); // user search for medication by name and form
router.get("/seach_medication_name_form_dosage", validateSearchMedicationByNameFRomDosageParams, userSearchMedicationNameFormDosageController ); // user search for medication by name, form and dosage
router.get("/get_user_medication", checkUserRole, userGetMedicationController ); // get all medication for specific user
router.post("/add_prescription_image", upload.single('prescription'), checkUserRole,   userAddPrescriptionImageController ); // user add priscription image
router.get("/check_user_prescription_status",  checkUserRole,   userPrescriptionStatusController ); // check user prescription for medication
router.get("/get_user_medication_require_prescription",  checkUserRole, userMedicatonRequiredPrescriptionController ); // get user medication that required prescrition
router.post("/add_medication_by_img", upload.single('prescription'),  checkUserRole, userAddMedicationThroughImageController ); // user add medication by image

router.post("/add_to_cart", validateAddMedicationParams, checkUserRole,   userAddMedicationToCartController ); // user add medication to cartlist
router.post("/increase_from_cart", validateUserCartParams, checkUserRole,   userIncreaseMedicationToCartController ); // user increase medication from cart list
router.post("/decrease_from_cart", validateUserCartParams, checkUserRole, userDecreaseMedicationToCartController ); // user decrease medication in cart list
router.post("/remove_from_cart", validateUserCartParams, checkUserRole, userRemoveMedicationToCartController ); // user remove medication from cart list
router.get("/user_cart", checkUserRole, userCartListController ); // user get all cart list
router.get("/cart_refill_status", validateUserCartQueryParams, checkUserRole,   userRefillStatusCartController ); // change medication refill in cart
router.post("/clear_cart", checkUserRole, userClearCartlistController ); // user clear cart list

router.post("/checkout", validateUserCheckOutParams, checkUserRole, userCheckOutController ); //  user checkout
router.post("/direct_checkout", validateUserCheckOutDirectParams, checkUserRole, userCheckOutFromAvailableMedController ); //  user checkout direct
router.post("/checkout/verification", validateUserCheckOutVerificationParams, checkUserRole, userCheckOutPaymentVerificationController ); //  user checkout
router.get("/pending_order", checkUserRole, userGetPendingOrderController ); // pending order
router.get("/not_delevered_order", checkUserRole, userGetNotDeliveredOrderController ); // not delivered order
router.get("/delivered_order", checkUserRole, userGetDeliveredOrderController ); //  delivered order


router.get("/ensentialCategory", checkUserRole, getPageEssentialCategoryController ); // list enssentail categories
router.get("/ensentialProduct", checkUserRole, getEssentialProductBycategoryController ); // list enssentail product unde categories
router.post("/ensentialProduct_add_cart", validateEnssntialCarttParams, checkUserRole, addEssentialProductToCartController ); // add product to cart
// router.post("/ensentialProduct_cart_increase", validateEnssntialcartIDtParams, checkUserRole, increaseEssentialProductToCartController ); // increase product in cart
// router.post("/ensentialProduct_cart_decrease", validateEnssntialcartIDtParams, checkUserRole, decreaseEssentialProductToCartController ); // decrease product in cart
// router.get("/ensentialProduct_cart_list", checkUserRole, getEssentialProductInCartController ); // get user cart list
// router.post("/checkout_enssential_product", checkUserRole, userCheckOutEssentialPRoductController ); // user checkout cart list

router.post("/subcribe_for_newsletter", validateEmailParams, subcribForNewsletterController ); // user subcribe for newsletter
router.get("/frquence_ask_ans", frequenceAskQuestionController ); // user subcribe for newsletter

//delete user acccount
router.delete("/delete_my_account", checkUserRole, userDeleteMyAccountController); //  user delete data from database

router.post("/account/delete_request",  sendDeleteOTP);
router.post("/account/delete_confirm", deleteAccountWithOTP);

export default router;