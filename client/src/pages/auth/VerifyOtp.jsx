import React from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
const VerifyOtp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!data.otp) {
      toast.error("Verification otp is required");
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", { otp: data.otp });
      if (res.data.success) {
        localStorage.setItem("resetToken", res.data.resetToken); // save token
        navigate("/reset-password");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Verification failed");
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
          Verify Your Email
        </h2>

        <InputField
          label="Verification OTP"
          type="text"
          placeholder="Enter verification OTP"
          {...register("otp", { required: "Verification otp is required" })}
          error={errors.otp?.message}
        />

        <Button type="submit">Verify</Button>
      </Motion.form>
    </div>
  );
};

export default VerifyOtp;
