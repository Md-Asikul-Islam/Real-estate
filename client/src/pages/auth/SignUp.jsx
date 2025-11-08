import React from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NavLink, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import api from "../../services/api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

// ✅ Regex
const userNameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_ ]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

// ✅ Zod schema
const signUpSchema = z.object({
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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

const SignUp = () => {
  const navigate = useNavigate();

  // ✅ React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  //  Submit Handler
const onSubmit = async (data) => {
  try {
    const res = await api.post("/auth/sign-up", data);
    toast.success(res.data?.message || "Account created successfully!");
    reset();
    navigate(`/verify-email`, { state: { email: data.email } });
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong!");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen  ">
      <Motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-[#D9EAFD]/35 p-6 sm:p-8 rounded-2xl border-2 border-white/50 shadow-lg w-full max-w-md backdrop-blur-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-600 ">
          Sign Up
        </h2>
        <InputField
          label="User Name"
          type="text"
          placeholder="Enter your username"
          {...register("userName")}
          error={errors.userName?.message}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />
        
        <Button  type="submit">Sign Up</Button>
        
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <NavLink
            to="/sign-in"
            className="text-blue-500 hover:underline font-medium"
          >
            Sign In
          </NavLink>
        </p>
      </Motion.form>
    </div>
  );
};

export default SignUp;
