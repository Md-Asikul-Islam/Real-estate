import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "What types of properties do you handle?",
    answer:
      "We handle residential, commercial, and land properties, including apartments, villas, offices, retail spaces, and plots—catering to buying, selling, or renting needs.",
  },
  {
    question: "Do you offer property management services?",
    answer:
      "Yes, we offer comprehensive property management services, including tenant management, rent collection, maintenance, and regular property inspections to ensure your investment is well cared for.",
  },
  {
    question: "What documents are required to buy or rent a property?",
    answer:
      "You’ll typically need proof of identity, address, and financial documents. For purchases, property registration and payment proof are required; for rentals, references and security deposit may be needed.",
  },
  {
    question: "Do you assist with property financing or home loans?",
    answer:
      "Yes, we guide you through financing options and connect you with trusted banks and lenders to make buying your property easier. ",
  },
  {
    question: "How can I schedule a property visit?",
    answer:
      "You can schedule a property visit online through our website, by filling out the “Schedule a Visit” form, or by contacting our team directly via phone or email. We’ll coordinate a time that’s convenient for you.",
  },
];

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpansion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-20" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 leading-snug tracking-tight"
        >
          Frequently Asked Questions
        </h2>

        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl shadow-sm sm:shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleExpansion(index)}
                  aria-expanded={isExpanded}
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                  className="w-full flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-t-xl text-left"
                >
                  <span className="font-medium text-gray-800 text-base sm:text-lg md:text-xl lg:text-lg">
                    {faq.question}
                  </span>
                  <FiChevronDown
                    className={`text-gray-500 text-lg sm:text-xl transition-transform duration-300 ease-in-out ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <Motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.35, ease: "easeInOut" }, opacity: { duration: 0.3, ease: "easeInOut" } }}
                      id={`panel-${index}-content`}
                      role="region"
                      aria-labelledby={`panel-${index}-header`}
                      className="overflow-hidden px-4 sm:px-6 text-gray-600 text-sm sm:text-base md:text-base lg:text-base leading-relaxed py-3 sm:py-4"
                    >
                      {faq.answer}
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FAQSection);
