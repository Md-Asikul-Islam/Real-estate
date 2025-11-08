import React from "react";
import { motion as Motion } from "framer-motion";

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  { title: "Our Mission", desc: "To provide seamless property experiences by offering transparency, trust, and top-notch customer service." },
  { title: "Our Vision", desc: "To be the leading real estate company in the region, helping clients make informed and rewarding property decisions." },
  { title: "Our Values", desc: "Integrity, excellence, customer-first approach, and innovation drive everything we do." },
  { title: "Our Expertise", desc: "Over 20 years of real estate experience with a strong reputation for success and reliability." },
  { title: "Sustainability", desc: "We promote eco-friendly construction practices and sustainable community development." },
  { title: "Community Impact", desc: "We support housing solutions that create positive social and economic change." },
];

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6 lg:p-8">
      {features.map((feature, i) => (
        <Motion.div
          key={feature.title}
          className="
            relative
            rounded-3xl
            p-6 sm:p-8 lg:p-10
            text-center
            cursor-pointer
            backdrop-blur-xl
            border border-white/20 dark:border-gray-700/30
            bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-900/30 dark:to-gray-800/20
            shadow-lg dark:shadow-black/20
            hover:shadow-2xl hover:scale-[1.03]
            transition-all duration-500
          "
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={featureVariants}
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 text-blue-600 dark:text-blue-400">
            {feature.title}
          </h2>
          <p className="text-gray-900 dark:text-gray-100 text-sm sm:text-base lg:text-base leading-relaxed">
            {feature.desc}
          </p>
          {/* Optional: subtle decorative gradient overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 dark:from-gray-800/20 dark:to-gray-900/10 pointer-events-none"></div>
        </Motion.div>
      ))}
    </div>
  );
};

export default React.memo(FeatureGrid);
