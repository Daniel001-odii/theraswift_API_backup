const express = require("express");

const router = express.Router();
import {
  signUpController,
  loginController,
  rootController,
} from "../controllers/";
import { validateLoginParams } from "../middleware/login.middleware";
import { validateSignupParams } from "../middleware/signup.middleware";

// theraswift routes
router.get("/", rootController);
router.post("/signup", validateSignupParams, signUpController);
router.post("/login",validateLoginParams, loginController);
// router.put("/editTodo", editTodo);
// router.delete("/deleteTodo", deleteTodo);

export default router;
