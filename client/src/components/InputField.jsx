import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {motion as Motion} from "framer-motion"

const InputField = ({ label, error, type, ...inputProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine actual input type
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-5">
      <label className="block mb-2 font-semibold text-gray-700">{label}</label>
      <div className="relative flex items-center">
        <input
          {...inputProps}
          type={inputType}
          className={`w-full px-4 py-3 bg-white backdrop-blur-sm text-gray-700 rounded-xl border border-gray-300
            outline-none transition-all duration-300
            ${error ? "focus-border-red-500 focus:ring-red-400" : "focus:border-blue-500 focus:ring-1 focus:ring-blue-400 focus:ring-opacity-30 "}`}
        />

        {/* Eye icon toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 flex items-center justify-center text-gray-500 hover:text-gray-700 h-full"
          >
            {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
          </button>
        )}
      </div>

      {error && (
        <Motion.p 
         initial={{ opacity: 0, x: -10 }}
         animate={{ opacity: 1, x: 0 }}
        className="text-red-500 text-sm mt-1 ml-1 ">{error}</Motion.p>
      )}
    </div>
  );
};

export default InputField;

