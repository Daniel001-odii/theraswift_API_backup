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
    validateHmoActionOnPatientSignupParams
} from "../validation/reg_login_validate";
import { 
    doctorSignUpController, 
    doctorSignInController,
    doctorRegisterPatient
} from "../controllers/reg_login.controller";
import { 
    doctorGetAllRegisteredPatient,
    doctorGetSingleRegisteredPatient
} from "../controllers/get_patient_detail.controller";
import { 
    doctorForgotPassworController,
    doctorResetPassworController
} from "../controllers/forgot_password.controller";
import {
    doctorDeletePatientPrescriptioController,
     patientPrescriptionController, 
     patientPrescriptionDetailController,
    } from "../controllers/patientPrescription.controller";
import { checkDoctorRole } from "../middleware/rolechecke.middleware";
import  upload  from "../middleware/medication_image.middleware";
import { doctorSearchMedicationNameController, doctorSearchMedicationNameFormController, doctorSearchMedicationNameFormDosageController } from "../controllers/medication.controller";
import { getpatientPriscriptionDeliverdeController, getpatientPriscriptionPendindController, getpatientPriscriptionProgressController, patientOderHmoController, patientOderOutPocketController } from "../controllers/patientMedicationOrder.controller";
import { doctorEmailVerificationController, doctorSendEmailController } from "../controllers/emailVerification.controller";
import { doctorGetPatientHmoApproveController, doctorGetPatientHmoDeniedController, doctorGetPatientHmoPendingController, doctorSentPatientToHmoController } from "../controllers/patientHmo.controller";
import { hmoApproveOrDeniedPatientController, hmoGetPatientHeApproveController, hmoGetPatientHeDeniedController, hmoGetPatientSentToHimController } from "../controllers/hmoActionOnPatient.controller";


router.post("/test", router.get("/", (req:any, res:any) => {
    res.json("Hello");
  }));  // doctor signup

router.post("/doctor_signup", validateDoctorSignupParams, doctorSignUpController);  // doctor signup
router.post("/doctor_send_email", validateDoctorSendEmailParams, doctorSendEmailController);  // doctor send email
router.post("/doctor_verified_email", validateDoctorVerifiedEmailParams, doctorEmailVerificationController);  // doctor verified email
router.post("/doctor_signin", validateDoctorSigninParams, doctorSignInController); // doctor login
router.post("/doctor_forgot_password", validateEmail, doctorForgotPassworController); // doctor forgot password
router.post("/doctor_reset_password", validateResetPassword, doctorResetPassworController); // doctor reset password


router.post("/register_patient", checkDoctorRole, upload, validatePatientRegParams,  doctorRegisterPatient); // doctor register his patient
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


router.post("/sent_pateint_to_hmo",  checkDoctorRole, doctorSentPatientToHmoController); // doctor sent pateint detail to hmo
router.get("/get_patient_hmo_pendig",  checkDoctorRole, doctorGetPatientHmoPendingController); // doctor get patient pending
router.get("/get_patient_hmo_approve",  checkDoctorRole, doctorGetPatientHmoApproveController); // doctor get patient approve
router.get("/get_patient_hmo_denied",  checkDoctorRole, doctorGetPatientHmoDeniedController); // doctor get patient denied


// hmo action
router.get("/hmo_get_patient_sent_to_him",  checkDoctorRole, hmoGetPatientSentToHimController); // hmo get patient sent to him
router.post("/hmo_aprove_denied_patient", validateHmoActionOnPatientSignupParams, checkDoctorRole, hmoApproveOrDeniedPatientController); // hmo approve or denied patient
router.get("/hmo_get_approve_patient",  checkDoctorRole, hmoGetPatientHeApproveController); // hmo get patient he approve
router.get("/hmo_get_denied_patient",  checkDoctorRole, hmoGetPatientHeDeniedController); // hmo get patient he denied



export default router;