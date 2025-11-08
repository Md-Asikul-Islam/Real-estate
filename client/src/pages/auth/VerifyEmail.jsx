import React from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!data.code) {
      toast.error("Verification code is required");
      return;
    }

    try {
      const response = await api.post("/auth/verify-email", { code: data.code }); 
      if (response.data.success) {
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/sign-in"), 1500);
      } else {
        toast.error(response.data.message || "Invalid or expired code");
      }
    } catch (error) {
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
          Verify Your Account
        </h2>

        <InputField
          label="Verification Code"
          type="text"
          placeholder="Enter verification code"
          {...register("code", { required: "Verification code is required" })}
          error={errors.code?.message}
        />

        <Button type="submit">Verify</Button>
      </Motion.form>
    </div>
  );
};

export default VerifyEmail;
