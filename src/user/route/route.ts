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
    validateSearchMedicationByNameFRomDosageParams
} from "../middlewares/requestValidate.middleware";
import { userEmailSignInController, userMobileNumberSignInController, userSignUpController } from "../controllers/regLogin.controller";
import { userSendEmailController, userEmailVerificationController } from "../controllers/emailVerification.controller";
import { userPhoneNumberVerificationController, userSendPhoneNumberController } from "../controllers/phoneNumberVerification.controller";
import { userEmailForgotPasswordController, userEmailResetPasswordController, userMobileForgotPasswordController, userMobileResetPasswordController } from "../controllers/forgotResetPassword.controller";
import { checkUserRole } from "../middlewares/roleChecker.middleware";
import { 
    userAddMedicationController, 
    userDecreaseMedicationController, 
    userGetMedicationController, 
    userIncreaseMedicationController,  
    userRemoveMedicationController, 
    userSearchMedicationController, 
    userSearchMedicationNameController,
    userSearchMedicationNameFormController,
    userSearchMedicationNameFormDosageController
} from "../controllers/medication.controller";
import { upload } from "../../utils/upload.utility";


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
router.post("/add_medication", validateUserAddMedicationParams, checkUserRole,   userAddMedicationController ); // user add medication
router.post("/increase_medication", validateAddMedicationParams, checkUserRole, userIncreaseMedicationController ); // user increase medication
router.post("/decrease_medication", validateAddMedicationParams, checkUserRole, userDecreaseMedicationController ); // user  decrease medication
router.post("/remove_medication", validateAddMedicationParams, checkUserRole, userRemoveMedicationController ); // user remove medication
router.get("/seach_medication",  userSearchMedicationController ); // user search for medication

router.get("/seach_medication_name", validateSearchMedicationByNameParams,  userSearchMedicationNameController ); // user search for medication by name
router.get("/seach_medication_name_form", validateSearchMedicationByNameFRomParams, userSearchMedicationNameFormController ); // user search for medication by name and form
router.get("/seach_medication_name_form_dosage", validateSearchMedicationByNameFRomDosageParams, userSearchMedicationNameFormDosageController ); // user search for medication by name, form and dosage
router.get("/get_user_medication", checkUserRole, userGetMedicationController ); // get all medication for specific user
export default router;
