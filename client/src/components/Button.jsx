import { motion as Motion } from "framer-motion";

const buttonVariants = {
  initial: { scale: 1, opacity: 0.9 },
  hover: { scale: 1.05, opacity: 1, transition: { duration: 0.25 } },
  tap: { scale: 0.97, opacity: 0.95, transition: { duration: 0.1 } },
};

const Button = ({ children, variant = "primary", className = "", width = "w-full", ...props }) => {
  const baseStyles =
    "text-center px-4 py-2 rounded-lg font-medium shadow-md transition";

  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg", // Sign In
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg", // Sign Out
  };

  return (
    <Motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      {...props}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${width}`}
    >
      {children}
    </Motion.button>
  );
};

export default Button;
