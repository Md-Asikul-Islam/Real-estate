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

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 h-full w-1 bg-linear-to-b from-blue-400 via-purple-400 to-pink-400 transform -translate-x-1/2 rounded-full"></div>

          {milestones.map((m, i) => (
            <Motion.div
              key={m.year}
              className="relative mb-16 w-full flex flex-col sm:flex-row justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            >
              {/* Icon */}
              <div className="absolute sm:relative top-0 left-1/2 transform -translate-x-1/2 sm:translate-x-0 mb-4 sm:mb-0 z-10">
                <div className="bg-white border-2 border-blue-400 rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                  {m.icon}
                </div>
              </div>

              {/* Timeline Card */}
              <div
                className={`relative bg-white border border-gray-200 shadow-md rounded-2xl p-6 sm:w-80 md:w-96 mt-6 sm:mt-0
                  ${i % 2 === 0 ? "sm:ml-12 sm:mr-auto" : "sm:mr-12 sm:ml-auto"}
                `}
              >
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

