import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  COOKIE_OPTIONS,
} from "../utils/token.js";
import sendEmail from "../utils/sendMail.js";

/*
  @desc    SignUp a new user
  @route   POST /api/auth/sign-up
  @access  Public
*/
const SignUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  const user = await User.create({ userName, email, password });

  // Generate verification token
  const sendCode = user.getVerificationCode();

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify Your Email",
      html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; margin: 0;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #4f46e5; color: #ffffff; text-align: center; padding: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Hello, ${
              user.userName
            }!</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
            <p>Thank you for registering an account with <strong>${
              process.env.COMPANY_NAME
            }</strong> ,Please verify your email to activate your account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 15px 25px; background-color: #f3f4f6; border-radius: 5px; letter-spacing: 2px;">
                ${sendCode}
              </span>
            </div>

            <p style="font-size: 14px; color: #666666;">
              This code will expire in 24 hours. If you did not create an account, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #999999;">
            <p>&copy; ${new Date().getFullYear()} ${
        process.env.COMPANY_NAME
      }. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
    });

    res.status(201).json({
      success: true,
      message:
        "User registered. Please check your email to verify your account.",
    });
  } catch (err) {
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Could not send verification email", 500));
  }
});

/*
  @desc    Verify email using 5-digit code
  @route   POST /api/auth/verify/
  @access  Public
*/
const VerifyEmail = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  if (!code) return next(new AppError("Verification code is required", 400));

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  const user = await User.findOne({
    verificationCode: hashedCode,
    verificationCodeExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Invalid or expired code", 400));

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
});

/*
  @desc    SignIn user
  @route   POST /api/auth/sign-in
  @access  Public
*/
const SignIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password +refreshToken +isVerified"
  );

  if (!user) return next(new AppError("Invalid email", 400));

  if (!user.isVerified) return next(new AppError("Email not verified", 403));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new AppError("Invalid password", 400));

  // টোকেন তৈরি
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Refresh token DB-তে save
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Cookie পাঠানো

  res.cookie("access_token", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  });
});

/*
  @desc    Get Current Logged-in User
  @route   GET /api/auth/me
  @access  Private
*/
const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: req.user,
  });
});

/*
  @desc    Refresh access token
  @route   GET /api/auth/refresh
  @access  Public (needs refresh cookie)
*/
const RefreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return next(new AppError("No refresh token provided", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new AppError("Invalid or expired refresh token", 401));
  }

  // Fetch user from DB
  const user = await User.findById(decoded.id).select(
    "+refreshToken +isVerified"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  console.log("🔹 User.refreshToken from DB:", user.refreshToken);

  // Check if DB token matches
  if (user.refreshToken !== token) {
    return next(new AppError("Refresh token mismatch", 403));
  }

  if (!user.isVerified) {
    return next(new AppError("Email not verified", 403));
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Rotate refresh token in DB
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookies
  res.cookie("access_token", newAccessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", newRefreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Tokens refreshed successfully",
    accessToken: newAccessToken, // optional for frontend
  });
});

/*
  @desc    Logout user
  @route   POST /api/auth/sign-out
  @access  Private
*/
const SignOut = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refresh_token;
  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }

  res.clearCookie("access_token", COOKIE_OPTIONS);
  res.clearCookie("refresh_token", COOKIE_OPTIONS);

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

/*
  @desc    Forgot Password
  @route   POST /api/auth/forgot-password
  @access  Public
*/
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Email is required", 400));

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    return res
      .status(200)
      .json({ success: true, message: "If email exists, OTP sent" });

  const sendOTP = user.getVerificationOTP();
  await user.save({ validateBeforeSave: false });
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password verification",
      html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; margin: 0;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #4f46e5; color: #ffffff; text-align: center; padding: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Hello, ${
              user.userName
            }!</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
            <p>Thank you for verify an account with <strong>${
              process.env.COMPANY_NAME
            }</strong>. Please verify your email to change password or create one .</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 15px 25px; background-color: #f3f4f6; border-radius: 5px; letter-spacing: 2px;">
                ${sendOTP}
              </span>
            </div>

            <p style="font-size: 14px; color: #666666;">
              This code will expire in 24 hours. If you did not create an account, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #999999;">
            <p>&copy; ${new Date().getFullYear()} ${
        process.env.COMPANY_NAME
      }. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
    });

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Could not send email", 500));
  }
});

/*
  @desc    Verify OTP
  @route   POST /api/auth/verify-otp
  @access  Public
*/
const verifyOTP = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) return next(new AppError("OTP is required", 400));

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    verificationOTP: hashedOTP,
    verificationOTPExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Invalid or expired OTP", 400));

  // OTP verified → remove OTP
  user.verificationOTP = undefined;
  user.verificationOTPExpires = undefined;

  // Generate password reset token
  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "OTP verified successfully.",
    resetToken,
    email: user.email,
  });
});

/*
  @desc    Reset Password
  @route   POST /api/auth/reset-password/:token
  @access  Public
*/
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, token } = req.body;
  if (!password || !token)
    return next(new AppError("Password and token required", 400));

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Invalid or expired token", 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
});

export {
  SignUp,
  VerifyEmail,
  SignIn,
  getMe,
  RefreshToken,
  SignOut,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
