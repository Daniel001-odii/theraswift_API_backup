const express = require("express");
const router = express.Router();

import { 
    validateSignupParams,
    validateEmailParams,
    validateEmailVerificatioParams
} from "../middlewares/requestValidate.middleware";
import { userSignUpController } from "../controllers/regLogin.controller";
import { userSendEmailController, userEmailVerificationController } from "../controllers/emailVerification.controller";


router.post("/user_signup", validateSignupParams, userSignUpController ); // user signup
router.post("/user_send_email", validateEmailParams, userSendEmailController ); // user send email
router.post("/user_resend_email", validateEmailParams, userSendEmailController ); // user resend email
router.post("/user_email_verification", validateEmailVerificatioParams, userEmailVerificationController  ); // user email verification

export default router;