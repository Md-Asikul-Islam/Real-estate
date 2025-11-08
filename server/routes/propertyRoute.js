import express from "express";
import {
  createProperty,
  uploadImages,
  getAllProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  togglePublish,
} from "../controllers/propertyController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


// Public
router.get("/", getAllProperties);

// Protected
router.get("/my", protect, getMyProperties);

// Dynamic route (must be last among GETs)
router.get("/:id", getPropertyById);
router.post("/", protect, createProperty);
router.patch("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.patch("/:id/images", protect, uploadImages);
router.patch("/:id/publish", protect, togglePublish);

export default router;