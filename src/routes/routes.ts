const express = require("express");

const router = express.Router();
import {
  signUpController,
  loginController,
  rootController,
} from "../controllers/";
import { validateSignupParams } from "../middleware/signup.middleware";

// theraswift routes
router.get("/", rootController);
router.post("/signup", validateSignupParams, signUpController);
router.post("/login", loginController);
// router.put("/editTodo", editTodo);
// router.delete("/deleteTodo", deleteTodo);

export default router;
