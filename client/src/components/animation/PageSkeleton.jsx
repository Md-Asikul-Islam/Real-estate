import React from "react";
import { motion as Motion } from "framer-motion";

const PageSkeleton = () => (
  <Motion.div
    className="p-8 animate-pulse text-gray-400"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="h-6 w-1/3 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
    <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
  </Motion.div>
);

export default PageSkeleton;
