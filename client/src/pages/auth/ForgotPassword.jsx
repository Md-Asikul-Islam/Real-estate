import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

// Zod schema
const forgotSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/forgot-password", data);
      toast.success(res.data.message || "Reset link sent to your email");
      reset();
      navigate("/verify-otp");
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
          Forgot Password
        </h2>

        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Button type="submit" >Verify</Button>
      </Motion.form>
    </div>
  );
};

export default ForgotPassword;