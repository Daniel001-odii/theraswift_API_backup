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
    validatePatientOderHmoperson
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
    doctorRemovepatientPrescriptionController,
     patientPrescriptionController,
     patientPrescriptionDeliveredDetailController,
     patientPrescriptionDetailController,
     patientPrescriptionDetailNOTDeliveredController
    } from "../controllers/patientPrescription.controller";
import { checkDoctorRole } from "../middleware/rolechecke.middleware";
import  upload  from "../middleware/medication_image.middleware";
import { doctorSendPatientOderHmoController, doctorSendPatientOderOutOFPocketController, doctorgetPatientOderPaid, doctorgetPatientOderPending, doctorgetPatientOderdelieverd } from "../controllers/patientOder.controller";
import { doctorgetPatientHmoApproved, doctorgetPatientHmoPending, doctorgetPatientHmodenied } from "../controllers/patientHmo.controller";

router.get("/testGet", (req: any,res: { json: (arg0: string) => void; })=>{res.json('return get')});  // doctor signup
router.post("/doctor_signup", validateDoctorSignupParams, doctorSignUpController);  // doctor signup
router.post("/doctor_signin", validateDoctorSigninParams, doctorSignInController); // doctor login
router.post("/doctor_forgot_password", validateEmail, doctorForgotPassworController); // doctor forgot password
router.post("/doctor_reset_password", validateResetPassword, doctorResetPassworController); // doctor reset password


router.post("/register_patient", checkDoctorRole, upload, validatePatientRegParams,  doctorRegisterPatient); // doctor register his patient
router.get("/all_registered_patient",  checkDoctorRole, doctorGetAllRegisteredPatient); // doctor get all his patient
router.post("/single_registered_patient", validatePatientid,  checkDoctorRole, doctorGetSingleRegisteredPatient); // doctor get single patient


router.post("/patient_prescription",  validateDrugPrescription,  checkDoctorRole, patientPrescriptionController); // doctor prescribe drug for patient
router.post("/patient_prescription_detail",  validatePatientidperson,  checkDoctorRole, patientPrescriptionDetailController); // doctor get  patient prescription
router.post("/patient_prescription_detail_delivered",  validatePatientidperson,  checkDoctorRole, patientPrescriptionDeliveredDetailController); // doctor get  patient prescription that wass delivered
router.post("/patient_prescription_detail_not_delivered",  validatePatientidperson,  checkDoctorRole, patientPrescriptionDetailNOTDeliveredController); // doctor get  patient prescription that was not delivered
router.post("/remove_patient_prescription",  validatePatientPrescriptionidperson,  checkDoctorRole, doctorRemovepatientPrescriptionController); // doctor remove medication from patient prescription

router.post("/patient_order_out_of_pocket",  validatePatientidperson,  checkDoctorRole, doctorSendPatientOderOutOFPocketController); // doctor send patient order out of pocket
router.post("/patient_order_hmo",  validatePatientOderHmoperson,  checkDoctorRole, doctorSendPatientOderHmoController); // doctor send patient order hmo
router.get("/patient_order_pending",  checkDoctorRole, doctorgetPatientOderPending); // doctor get patient order pending
router.get("/patient_order_paid",  checkDoctorRole, doctorgetPatientOderPaid); // doctor get patient order paid
router.get("/patient_order_delieverd",  checkDoctorRole, doctorgetPatientOderdelieverd); // doctor get patient order delivered
router.get("/patient_hmo_pending",  checkDoctorRole, doctorgetPatientHmoPending); // doctor get patient hmo pending
router.get("/patient_hmo_approved",  checkDoctorRole, doctorgetPatientHmoApproved); // doctor get patient hmo approved
router.get("/patient_hmo_denied",  checkDoctorRole, doctorgetPatientHmodenied); // doctor get patient hmo denied



export default router;