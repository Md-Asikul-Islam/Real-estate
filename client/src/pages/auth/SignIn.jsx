import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import api from "../../services/api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import googleIcon from "../../assets/google.png";
import githubIcon from "../../assets/github.png";

// Zod validation schema
const signInSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const SignIn = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  // Email/Password login
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/sign-in", data);
      toast.success(res.data?.message || "Logged in successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong!";
      toast.error(message);
    }
  };

  // Social login URLs
  const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_URL}/oauth/google`;
  const GITHUB_LOGIN_URL = `${import.meta.env.VITE_API_URL}/oauth/github`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="bg-[#D9EAFD]/35 p-6 sm:p-8 rounded-2xl border-2 border-white/50 shadow-lg w-full max-w-md backdrop-blur-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-600 dark:text-gray-100">
          Sign In
        </h2>

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message}
        />

        {/* Password */}
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between p-3">
          <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500"
              {...register("remember")}
            />
            <span>Remember me</span>
          </label>

          <NavLink
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </NavLink>
        </div>

        {/* Sign In Button */}
        <Button type="submit">Sign In</Button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <hr className="grow border-gray-300 dark:border-gray-600" />
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
            OR
          </span>
          <hr className="grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => (window.location.href = GOOGLE_LOGIN_URL)}
            className="flex items-center justify-center px-3 py-1 gap-2  text-blue-500 "
          >
            <img src={googleIcon} alt="Google" className="w-6.5 h-6.5" />
            Sign in with Google
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = GITHUB_LOGIN_URL)}
            className="flex items-center justify-center gap-2 px-3 py-1  text-blue-500 "
          >
            <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <NavLink
            to="/sign-up"
            className="text-blue-500 hover:underline font-medium"
          >
            Sign Up
          </NavLink>
        </p>
      </Motion.form>
    </div>
  );
};

export default SignIn;
