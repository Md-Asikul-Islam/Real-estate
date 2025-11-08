import React, { useState, useEffect } from "react";
import loader from "../assets/loader.webp"
const Loader = ({ duration = 3000, fullScreen = false, message = "Loading..." }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timeout); 
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" : "py-6"
      }`}
      role="status"
      aria-live="polite"
    >
      <img src={loader} alt="Loading..." className="bg-[ #F1F3F8] w-16 h-16 animate-spin" />
      {message && (
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;

