import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

/*
  @desc   Get user profile
  @route  GET /api/users/profile
  @access Private
*/
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password -refreshToken");
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({ success: true, user });
});

/*
  @desc   Update user profile
  @route  PUT /api/users/profile
  @access Private
*/
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("User not found", 404));

  const { userName, email } = req.body;

  // শুধুমাত্র basic fields update করো
  if (userName) user.userName = userName;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

/*
  @desc   Change password
  @route  PUT /api/users/change-password
  @access Private
*/
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!user) return next(new AppError("User not found", 404));

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return next(new AppError("Current password is incorrect", 400));

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password changed successfully" });
});

/*
  @desc   Delete Profile
  @route  DELETE /api/users/delete
  @access Private
*/
const deleteProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  await User.findByIdAndDelete(req.user._id);

  // Clear cookies
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
});

export { getUserProfile, updateUserProfile, changePassword, deleteProfile };

