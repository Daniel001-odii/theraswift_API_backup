const express = require("express");
const router = express.Router();

import { 
    validateDoctorSignupParams, 
    validateDoctorSigninParams,
    validatePatientRegParams, 
    validatePatientid,
    validateEmail,
    validateResetPassword,
    validateDrugPrescription,
    validatePatientidperson,
    validatePatientPrescriptionidperson,
    validatePatientOderHmoperson,
    validateSearchMedByName,
    validateSearchMedByNameForm,
    validateSearchMedByNameFormDosage,
    validateDeletePatientprescription,
    validatePatientidQueryperson,
    validateDoctorSendEmailParams,
    validateDoctorVerifiedEmailParams,
    validateHmoActionOnPatientSignupParams,
    validateHmoGetPatientOrderParams,
    validateHmoTakeActionOnPatientOrderParams,
    validateDoctorSendPhoneNumberParams,
    validateDoctorVerifiedPhoneNumberParams,
    validateDoctorSigninPhoneNumberParams,
    validatePhonNumber,
    validateResetPasswordByPhoneNumber
} from "../validation/reg_login_validate";
import { 
    doctorSignUpController, 
    doctorSignInController,
    doctorRegisterPatient,
    doctorMobileNumberSignInController
} from "../controllers/reg_login.controller";
import { 
    doctorGetAllRegisteredPatient,
    doctorGetSingleRegisteredPatient
} from "../controllers/get_patient_detail.controller";
import { 
    doctorForgotPassworController,
    doctorMobileForgotPasswordController,
    doctorMobileResetPasswordController,
    doctorResetPassworController
} from "../controllers/forgot_password.controller";
import {
    doctorDeletePatientPrescriptioController,
     patientPrescriptionController, 
     patientPrescriptionDetailController,
    } from "../controllers/patientPrescription.controller";
import { checkDoctorRole } from "../middleware/rolechecke.middleware";
import { upload } from "../../utils/upload.utility";
import { doctorSearchMedicationNameController, doctorSearchMedicationNameFormController, doctorSearchMedicationNameFormDosageController } from "../controllers/medication.controller";
import { getpatientPriscriptionDeliverdeController, getpatientPriscriptionPendindController, getpatientPriscriptionProgressController, patientOderHmoController, patientOderOutPocketController } from "../controllers/patientMedicationOrder.controller";
import { doctorEmailVerificationController, doctorPhoneNumberVerificationController, doctorSendEmailController, doctorSendPhoneNumberController } from "../controllers/emailVerification.controller";
import { doctorGetPatientHmoApproveController, doctorGetPatientHmoDeniedController, doctorGetPatientHmoPendingController, doctorSentPatientToHmoController } from "../controllers/patientHmo.controller";
import { hmoApproveOrDeniedPatientController, hmoGetPatientHeApproveController, hmoGetPatientHeDeniedController, hmoGetPatientSentToHimController } from "../controllers/hmoActionOnPatient.controller";
import { hmoGetPatientOrdeHeTakeActionController, hmoGetPatientOrderSentToHimController, hmoTakeActionOnOrderSentToHimController } from "../controllers/hmoOrderAction.controller";


router.post("/test", router.get("/", (req:any, res:any) => {
    res.json("Hello");
  }));  // doctor signup

router.post("/doctor_signup", validateDoctorSignupParams, doctorSignUpController);  // doctor signup
router.post("/doctor_send_email", validateDoctorSendEmailParams, doctorSendEmailController);  // doctor send email
router.post("/doctor_verified_email", validateDoctorVerifiedEmailParams, doctorEmailVerificationController);  // doctor verified email
router.post("/doctor_send_phone_number", validateDoctorSendPhoneNumberParams, doctorSendPhoneNumberController);  // doctor send phone number
router.post("/doctor_verified_phone_number", validateDoctorVerifiedPhoneNumberParams, doctorPhoneNumberVerificationController);  // doctor verified phone number
router.post("/doctor_signin", validateDoctorSigninParams, doctorSignInController); // doctor login with email
router.post("/doctor_signin_phone_number", validateDoctorSigninPhoneNumberParams, doctorMobileNumberSignInController); // doctor login with password
router.post("/doctor_forgot_password", validateEmail, doctorForgotPassworController); // doctor forgot password by email
router.post("/doctor_reset_password", validateResetPassword, doctorResetPassworController); // doctor reset password by email
router.post("/doctor_forgot_password_by_phone_number", validatePhonNumber, doctorMobileForgotPasswordController); // doctor forgot password by phone number
router.post("/doctor_reset_password_by_phone_number", validateResetPasswordByPhoneNumber, doctorMobileResetPasswordController); // doctor reset password by phone number


router.post("/register_patient", checkDoctorRole, validatePatientRegParams,  doctorRegisterPatient); // doctor register his patient
router.get("/all_registered_patient",  checkDoctorRole, doctorGetAllRegisteredPatient); // doctor get all his patient
router.get("/single_registered_patient", validatePatientid,  checkDoctorRole, doctorGetSingleRegisteredPatient); // doctor get single patient

router.get("/seach_medication_name", validateSearchMedByName,  doctorSearchMedicationNameController ); // doctor search for medication by name
router.get("/seach_medication_name_form", validateSearchMedByNameForm, doctorSearchMedicationNameFormController ); // doctor search for medication by name and form
router.get("/seach_medication_name_form_dosage", validateSearchMedByNameFormDosage, doctorSearchMedicationNameFormDosageController ); // doctor search for medication by name, form and dosage


router.post("/patient_prescription",  validateDrugPrescription,  checkDoctorRole, patientPrescriptionController); // doctor prescribe drug for patient
router.get("/patient_prescription_detail",  validatePatientidperson,  checkDoctorRole, patientPrescriptionDetailController); // doctor get  patient prescription
router.post("/delete_patient_prescription",  validateDeletePatientprescription,  checkDoctorRole, doctorDeletePatientPrescriptioController); // doctor delete  patient prescription


router.post("/patient_order_with_hmo",  validatePatientidperson,  checkDoctorRole, patientOderHmoController); // order with hmo
router.post("/patient_order_with_outpocket",  validatePatientidperson,  checkDoctorRole, patientOderOutPocketController); // order out of pocket
router.get("/get_patient_order_pending",  validatePatientidQueryperson,  checkDoctorRole, getpatientPriscriptionPendindController); // get patient order that is pending
router.get("/get_patient_order_progress",  validatePatientidQueryperson,  checkDoctorRole, getpatientPriscriptionProgressController); // get patient order that is progress
router.get("/get_patient_order_delivered",  validatePatientidQueryperson,  checkDoctorRole, getpatientPriscriptionDeliverdeController); // get patient ordr that is deliverde

router.post("/sent_pateint_to_hmo", upload.single('medImg'),  checkDoctorRole, doctorSentPatientToHmoController); // doctor sent pateint detail to hmo
router.get("/get_patient_hmo_pendig",  checkDoctorRole, doctorGetPatientHmoPendingController); // doctor get patient pending
router.get("/get_patient_hmo_approve",  checkDoctorRole, doctorGetPatientHmoApproveController); // doctor get patient approve
router.get("/get_patient_hmo_denied",  checkDoctorRole, doctorGetPatientHmoDeniedController); // doctor get patient denied

// hmo action
router.get("/hmo_get_patient_sent_to_him",  checkDoctorRole, hmoGetPatientSentToHimController); // hmo get patient sent to him
router.post("/hmo_aprove_denied_patient", validateHmoActionOnPatientSignupParams, checkDoctorRole, hmoApproveOrDeniedPatientController); // hmo approve or denied patient
router.get("/hmo_get_approve_patient",  checkDoctorRole, hmoGetPatientHeApproveController); // hmo get patient he approve
router.get("/hmo_get_denied_patient",  checkDoctorRole, hmoGetPatientHeDeniedController); // hmo get patient he denied

// not doc
//hmo order action 
router.get("/hmo_get_patient_order_sent_to_him", validateHmoGetPatientOrderParams, checkDoctorRole, hmoGetPatientOrderSentToHimController); // hmo get patient order sent to him
router.post("/hmo_take_action_on_order", validateHmoTakeActionOnPatientOrderParams, checkDoctorRole, hmoTakeActionOnOrderSentToHimController); // hmo take action on patient order
router.get("/hmo_get_patient_order_action_taken_on", validateHmoGetPatientOrderParams, checkDoctorRole, hmoGetPatientOrdeHeTakeActionController); // hmo get patient order he take action on



export default router;