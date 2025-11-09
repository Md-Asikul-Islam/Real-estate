import React from "react";
import { motion as Motion } from "framer-motion";
import { FaBuilding, FaAward, FaRocket, FaGlobe, FaUsers } from "react-icons/fa";

const milestones = [
  {
    year: "2005",
    title: "Company Founded",
    description: "Started as a small real estate agency.",
    icon: <FaBuilding className="text-blue-500 text-xl" />,
  },
  {
    year: "2010",
    title: "10,000+ Properties Sold",
    description: "Sold 10,000+ properties nationwide.",
    icon: <FaUsers className="text-green-500 text-xl" />,
  },
  {
    year: "2015",
    title: "Expanded to Commercial Sector",
    description: "Focused on commercial real estate solutions.",
    icon: <FaGlobe className="text-purple-500 text-xl" />,
  },
  {
    year: "2020",
    title: "Awarded Best Real Estate Company",
    description: "Top-performing real estate firm.",
    icon: <FaAward className="text-yellow-500 text-xl" />,
  },
  {
    year: "2023",
    title: "Launched Online Property Portal",
    description: "Seamless online property platform.",
    icon: <FaRocket className="text-pink-500 text-xl" />,
  },
];

const Timeline = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl sm:text-4xl font-bold text-center mb-12">
          Our Journey
        </h2>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">

          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-linear-to-b from-blue-400 via-purple-400 to-pink-400 transform -translate-x-1/2 z-0"></div>

          {/* Timeline Items */}
          {milestones.map((m, i) => (
            <Motion.div
              key={m.year}
              className={`relative flex flex-col sm:flex-row items-center mb-16 z-10`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              {/* Left Card */}
              <div
                className={`hidden sm:flex w-1/2 justify-${i % 2 === 0 ? "end" : "start"} px-4`}
              >
                {i % 2 === 0 && (
                  <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 w-80">
                    <h3 className="text-blue-600 font-semibold text-lg">
                      {m.year} — {m.title}
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Icon (Always centered on the line) */}
              <div className="flex items-center justify-center bg-white border-2 border-blue-400 rounded-full w-12 h-12 shadow-md z-10">
                {m.icon}
              </div>

              {/* Right Card */}
              <div
                className={`hidden sm:flex w-1/2 justify-${i % 2 === 0 ? "start" : "end"} px-4`}
              >
                {i % 2 !== 0 && (
                  <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 w-80">
                    <h3 className="text-blue-600 font-semibold text-lg">
                      {m.year} — {m.title}
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden mt-6 text-center bg-white border border-gray-200 shadow-md rounded-2xl p-6 w-full">
                <h3 className="text-blue-600 font-semibold text-lg">
                  {m.year} — {m.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {m.description}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Timeline);
