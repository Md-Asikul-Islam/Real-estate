import express from "express";
import {
  SignUp,
  VerifyEmail,
  SignIn,
  getMe,
  RefreshToken,
  SignOut,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";
import validate from "./../middlewares/validate.js";
import {
  signUpSchema,
  signInSchema,
  forgotSchema,
} from "../validators/authValidation.js";
import { protect } from "../middlewares/authMiddleware.js";
const authRouter = express.Router();
//  Auth routes
authRouter.post("/sign-up", validate(signUpSchema), SignUp);
authRouter.post("/verify-email", VerifyEmail);
authRouter.post("/sign-in", validate(signInSchema), SignIn);
authRouter.get("/refresh", RefreshToken);
authRouter.post("/sign-out", SignOut);
authRouter.get("/me", protect, getMe);

//  Forgot/Reset Password
authRouter.post("/forgot-password", validate(forgotSchema), forgotPassword);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
