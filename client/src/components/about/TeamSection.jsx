// src/components/TeamSection.jsx
import React from "react";
import { motion as Motion } from "framer-motion";

//  Static assets (fast caching handled by Vite/Webpack)
import ceo from "../../assets/employee/ceo.webp";
import coo from "../../assets/employee/coo.webp";
import sales from "../../assets/employee/manager.webp";
import marketing from "../../assets/employee/maeketing.webp";

// 🧩 Data with short quotes
const teamMembers = [
  {
    name: "MR Habibur Rahman",
    role: "Chief Executive Officer (CEO)",
    photo: ceo,
    quote: "Leading with vision and purpose to shape a better future.",
  },
  {
    name: "Muhib Al Choudhury",
    role: "Chief Operating Officer (COO)",
    photo: coo,
    quote: "Turning strategy into seamless execution every day.",
  },
  {
    name: "Navid Hassan",
    role: "Head of Sales",
    photo: sales,
    quote: "Building trust and driving growth through relationships.",
  },
  {
    name: "Sara Wilson",
    role: "Marketing Lead",
    photo: marketing,
    quote: "Crafting stories that connect hearts and inspire action.",
  },
];

const TeamSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl sm:text-4xl font-bold text-center mb-12">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition-transform duration-300"
            >
              <img
                src={member.photo}
                alt={member.name}
                loading="lazy"
                decoding="async"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg sm:text-xl text-gray-800">
                {member.name}
              </h3>
              <p className="text-gray-500 mb-2">{member.role}</p>
              <p className="text-sm py-4 text-gray-400 italic">
                “{member.quote}”
              </p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TeamSection);
