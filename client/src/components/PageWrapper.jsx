
import React from "react";
import { motion as Motion } from "framer-motion";


const defaultVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const defaultTransition = {
  duration: 0.4,
  ease: "easeInOut",
};

const PageWrapper = ({
  children,
  variants = defaultVariants,
  transition = defaultTransition,
  className = "",
}) => (
  <Motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={variants}
    transition={transition}
    className={`relative ${className}`}
    style={{
      willChange: "transform, opacity",
      WebkitBackfaceVisibility: "hidden", // smoother GPU compositing
    }}
  >
    {children}
  </Motion.div>
);

export default PageWrapper;
