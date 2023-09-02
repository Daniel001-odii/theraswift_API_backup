const express = require("express");
const router = express.Router();

import { validateSignupParams } from "../middlewares/requestValidate.middleware";
import { userSignUpController } from "../controllers/regLogin.controller";


router.post("/user_signup", validateSignupParams, userSignUpController ); // user signup

export default router;