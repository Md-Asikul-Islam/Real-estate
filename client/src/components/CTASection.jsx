import React from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <Motion.div
      className="mt-8 sm:mt-12 text-center px-2 sm:px-0"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-4 leading-relaxed">
        Looking for your dream home or investment property?
      </p>

      <Link
        to="/contact"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        Contact Us
      </Link>

      <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
        Our team is ready to assist you with expert guidance and market insights.
      </p>
    </Motion.div>
  );
};

export default React.memo(CTASection);
