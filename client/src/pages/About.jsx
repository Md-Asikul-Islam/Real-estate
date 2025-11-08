import React, { lazy, Suspense, memo } from "react";
import { motion as Motion } from "framer-motion";
import Loader from "../components/Loader";

// Lazy load feature and CTA sections
const FeatureGrid = lazy(() => import("../components/about/FeatureGrid"));
const CTASection = lazy(() => import("../components/about/CTASection"));
const FAQSection = lazy(() => import("../components/about/FAQSection"));
const Timeline = lazy(() => import("../components/about/Timeline"));
const TeamSection = lazy(() => import("../components/about/TeamSection"));
const Testimonial = lazy(() => import("../components/about/Testimionial"));
const About = () => {
  return (
    <section
      className="bg-gray-50 py-12 sm:py-16 lg:py-20"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Motion.h1
          id="about-heading"
          className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-center leading-snug"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          About BTI Real Estate
        </Motion.h1>

        {/* Description */}
        <Motion.p
          className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          BTI Real Estate is dedicated to helping clients find their dream homes
          and investment properties effortlessly. We specialize in residential,
          commercial, and rental properties, providing expert guidance and
          personalized services.
        </Motion.p>

        {/* Lazy Load Inner Sections */}
        <Suspense fallback={<Loader />}>
          <FeatureGrid />
          <Timeline />
          <TeamSection />
          <Testimonial />
          <FAQSection />
          <CTASection />
        </Suspense>
      </div>
    </section>
  );
};

export default memo(About);
