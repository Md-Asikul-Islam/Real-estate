// ResetPassword.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate} from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 chars")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number & special char"
    ),
});

const ResetPassword = () => {
  const navigate = useNavigate();

  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

const onSubmit = async (data) => {
  try {
    const resetToken = localStorage.getItem("resetToken"); // get token
    const res = await api.post(`/auth/reset-password`, {
      password: data.password,
      token: resetToken,
    });
    toast.success(res.data.message);
    localStorage.removeItem("resetToken"); // clear token
    reset();
    navigate("/sign-in");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-[#D9EAFD]/35 p-6 sm:p-8 rounded-2xl border-2 border-white/50 shadow-lg w-full max-w-md backdrop-blur-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-600">
          Reset Password
        </h2>

        <InputField
          label="New Password"
          type="password"
          placeholder="Enter new password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit">Reset Password</Button>
      </Motion.form>
    </div>
  );
};

export default ResetPassword;
