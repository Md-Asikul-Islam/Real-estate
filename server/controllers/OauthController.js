import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken, COOKIE_OPTIONS } from "../utils/token.js";

const oauthSuccess = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError("OAuth authentication failed", 401));

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh_token", refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.redirect(process.env.FRONTEND_URL || "http://localhost:5173/");
});

const oauthFailure = (req, res) => {
  return res.status(401).json({ success: false, message: "OAuth authentication failed" });
};
export {oauthSuccess,oauthFailure }