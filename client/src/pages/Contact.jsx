import React, { useState } from "react";
import { motion as Motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
   <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Contact Us
        </Motion.h1>

        <Motion.p
          className="text-gray-600 text-sm sm:text-base md:text-lg text-center mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Have a question or want to get in touch? Fill out the form below and
          we will get back to you shortly.
        </Motion.p>

        {/* Layout: 1 column mobile → 2 column large */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Email"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Message"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-md transition-colors duration-300 text-sm sm:text-base"
            >
              Send Message
            </button>
          </Motion.form>

          {/* Contact Info */}
          <Motion.div
            className="flex flex-col justify-center space-y-6 bg-blue-50 rounded-xl shadow-inner p-6 sm:p-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                Address
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                123 Real Estate Avenue, Dhaka, Bangladesh
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                Phone
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                +880 1234 567 890
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                Email
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                info@realestate.com
              </p>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
