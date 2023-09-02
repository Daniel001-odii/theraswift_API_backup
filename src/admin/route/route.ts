const express = require("express");
const router = express.Router();
import { 
    validateAdminSigninParams,
    validateEmail,
    validateResetPassword
} from "../middleware/requestValidate.middleware";

import { adminSignInController } from "../controllers/regLogin.controller";
import {
     adminForgotPassworController, 
     adminResetPassworController 
} from "../controllers/forgotPassword.controller";


router.post("/admin_signin", validateAdminSigninParams, adminSignInController); // admin login
router.post("/admin_forgot_password", validateEmail, adminForgotPassworController); // doctor forgot password
router.post("/admin_reset_password", validateResetPassword, adminResetPassworController); // doctor reset password


export default router;