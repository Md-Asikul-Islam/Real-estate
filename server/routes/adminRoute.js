// routes/adminRoutes.js
import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllProperties,
  updatePropertyStatus,
  getAdminSummary,
} from "../controllers/adminController.js";

const router = express.Router();

//  সব রাউটে অ্যাডমিন প্রটেকশন থাকবে
router.use(protect, adminOnly);

//  User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

//  Property management
router.get("/properties", getAllProperties);
router.patch("/properties/:id/status", updatePropertyStatus);

//  Dashboard summary / analytics
router.get("/summary", getAdminSummary);

export default router;
