import express from "express";
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  deleteProfile 
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";


const userRouter = express.Router();

// GET profile
userRouter.get("/profile", protect, getUserProfile);

// UPDATE profile (avatar included)
userRouter.put("/profile", protect,  updateUserProfile);

// CHANGE password
userRouter.put("/change-password", protect, changePassword);

// DELETE profile
userRouter.delete("/delete", protect, deleteProfile);

export default userRouter;
