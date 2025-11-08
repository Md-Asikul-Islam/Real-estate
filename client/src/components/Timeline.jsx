// src/components/TimelineSection.jsx
import React from "react";
import { motion as Motion } from "framer-motion";

const milestones = [
  { year: "2005", event: "Company Founded" },
  { year: "2010", event: "10,000+ Properties Sold" },
  { year: "2015", event: "Expanded to Commercial Properties" },
  { year: "2020", event: "Awarded Best Real Estate Company" },
  { year: "2023", event: "Launched Online Property Portal" },
];

const Timeline = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl sm:text-4xl font-bold text-center mb-12">
          Our Journey
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="border-l-2 border-blue-500 absolute h-full left-1/2 transform -translate-x-1/2"></div>

          {milestones.map((m, i) => (
            <Motion.div
              key={i}
              className={`mb-12 flex justify-${i % 2 === 0 ? "start" : "end"} w-full relative`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="bg-blue-100/20 border border-blue-500 rounded-lg p-6 w-64 sm:w-80 shadow-lg">
                <h3 className="font-semibold text-blue-600">{m.year}</h3>
                <p className="text-gray-700 mt-1">{m.event}</p>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Timeline);
