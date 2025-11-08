import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  clearUserState,
} from "../features/user/userSlice";

import InputField from "../components/InputField";
import Button from "../components/Button";

const userNameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_ ]+$/;

const profileSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "User name must be at least 3 characters long")
    .max(27, "User name cannot exceed 27 characters")
    .regex(
      userNameRegex,
      "User name must contain at least one letter and may include numbers or underscores"
    ),
  email: z.string().trim().email("Invalid email format"),
});

const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Current password must be at least 8 characters long"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Safe destructure
  const userState = useSelector((state) => state.user || {});
  const { user, loading, } = userState;

  // ===================== RHF + Zod =====================
  const {
    register,
    handleSubmit,
    reset: resetProfile,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: "",
      email: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmitRHF,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  // ===================== Fetch User Profile =====================
  useEffect(() => {
     if (!user) { // fetch only if not already in state
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  // ✅ Populate form when user is loaded
  useEffect(() => {
    if (user) {
      resetProfile({
        userName: user.userName || "",
        email: user.email || "",
      });
    }
  }, [user, resetProfile]);

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/sign-in");
    }
  }, [loading, user, navigate]);

  // ===================== Handlers =====================
  const onProfileSubmit = async (data) => {
    try {
      const res = await dispatch(updateUserProfile(data)).unwrap();
      toast.success(res?.message || "Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      const res = await dispatch(changePassword(data)).unwrap();
      toast.success(res?.message || "Password updated successfully!");
      resetPassword();
    } catch (err) {
      toast.error(err || "Failed to change password");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const res = await dispatch(deleteAccount()).unwrap();
      toast.success(res || "Your account deleted successfully!");
      dispatch(clearUserState());
      navigate("/sign-in");
    } catch (err) {
      toast.error(err || "Failed to delete account");
    }
  };

  // ===================== Render =====================
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="bg-[#D9EAFD]/35 p-6 sm:p-8 rounded-2xl border-2 border-white/50 shadow-lg w-full max-w-md backdrop-blur-lg space-y-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-600 dark:text-gray-100">
          My Profile
        </h2>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
          <InputField
            label="User Name"
            type="text"
            placeholder="Your Name"
            {...register("userName")}
            error={errors.userName?.message}
          />
          <InputField
            label="Email"
            type="email"
            placeholder="Your Email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Button type="submit" loading={loading ? "true" : undefined}>
            Update Profile
          </Button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmitRHF(onPasswordSubmit)} className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            placeholder="Current Password"
            {...registerPassword("currentPassword")}
            error={passwordErrors.currentPassword?.message}
          />
          <InputField
            label="New Password"
            type="password"
            placeholder="New Password"
            {...registerPassword("newPassword")}
            error={passwordErrors.newPassword?.message}
          />
          <Button type="submit" loading={loading ? "true" : undefined}>
            Change Password
          </Button>
        </form>

        {/* Delete Account */}
        <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
          Delete Account
        </Button>
      </Motion.div>
    </div>
  );
};

export default Profile;
