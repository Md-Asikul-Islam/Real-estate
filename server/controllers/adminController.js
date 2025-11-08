// controllers/adminController.js
import User from "../models/userModel.js";
import Property from "../models/propertyModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

/*
  @desc   Get all users (Admin only)
  @route  GET /api/admin/users
  @access Private/Admin
*/
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Lightweight query — exclude password, refreshToken
  const users = await User.find({}, "-password -refreshToken")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // ✅ convert to plain JS objects (faster in read-heavy ops)

  const totalUsers = await User.countDocuments();

  res.status(200).json({
    success: true,
    count: users.length,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    users,
  });
});

/*
  @desc   Get single user by ID
  @route  GET /api/admin/users/:id
  @access Private/Admin
*/
 const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({ success: true, user });
});

/*
  @desc   Update user role (promote/demote)
  @route  PATCH /api/admin/users/:id/role
  @access Private/Admin
*/
 const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return next(new AppError("Invalid role type", 400));
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    "-password -refreshToken"
  );

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user,
  });
});

/*
  @desc   Delete user
  @route  DELETE /api/admin/users/:id
  @access Private/Admin
*/
 const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

/*
  @desc   Get all properties
  @route  GET /api/admin/properties
  @access Private/Admin
*/
 const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find()
    .populate("owner", "userName email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    properties,
  });
});

/*
  @desc   Update property status (approve/reject)
  @route  PATCH /api/admin/properties/:id/status
  @access Private/Admin
*/
 const updatePropertyStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return next(new AppError("Invalid property status", 400));
  }

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("owner", "userName email");

  if (!property) return next(new AppError("Property not found", 404));

  res.status(200).json({
    success: true,
    message: `Property ${status} successfully`,
    property,
  });
});

/*
  @desc   Get system summary (optional analytics)
  @route  GET /api/admin/summary
  @access Private/Admin
*/
 const getAdminSummary = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const pendingProperties = await Property.countDocuments({ status: "pending" });
  const approvedProperties = await Property.countDocuments({ status: "approved" });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProperties,
      pendingProperties,
      approvedProperties,
    },
  });
});


export {getAllUsers,getUserById,updateUserRole,deleteUser, getAllProperties,updatePropertyStatus, getAdminSummary }