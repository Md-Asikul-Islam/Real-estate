// src/components/TestimonialsSection.jsx
import React from "react";
import { motion as Motion } from "framer-motion";

const testimonials = [
  { name: "Alice Brown", role: "Homeowner", message: "BTI Real Estate helped me find my dream home effortlessly. Highly recommend!" },
  { name: "Robert Green", role: "Investor", message: "Excellent guidance and professional service. Very happy with my investments." },
  { name: "Maria White", role: "Tenant", message: "The team made renting a smooth and transparent process. Great experience!" },
];

const Testimonial = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl sm:text-4xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Motion.div
              key={i}
              className="bg-gray-50 shadow-lg rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <p className="text-gray-700 mb-3">"{t.message}"</p>
              <h4 className="font-semibold text-blue-600">{t.name}</h4>
              <p className="text-gray-500 text-sm">{t.role}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonial);
