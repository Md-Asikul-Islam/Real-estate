import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";

// Protect middleware: cookie-based auth with refresh token auto-renew
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.access_token;

  // No access token, try refresh token
  if (!token && req.cookies.refresh_token) {
    const refreshToken = req.cookies.refresh_token;
    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const user = await User.findById(decodedRefresh.id).select(
        "-password -refreshToken"
      );
      if (!user) throw new Error("User not found");

      // Generate new access token
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 min
      });

      req.user = user;
      return next();
    } catch (err) {
      console.error("[protect] Refresh token invalid:", err.message);
      return next(new AppError("Invalid refresh token", 401));
    }
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[protect] Access token invalid:", err.message);
    return next(new AppError("Not authorized, invalid token", 401));
  }
});

// Admin-only access
const adminOnly = (req, res, next) => {
  if (!req.user) return next(new AppError("Not authorized", 401));
  if (req.user.role !== "admin")
    return next(new AppError("Admin only access", 403));
  next();
};

export { protect, adminOnly };
