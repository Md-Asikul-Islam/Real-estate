// src/pages/Home.jsx
import {  lazy, Suspense, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Button from "../components/Button";
import banner from "../assets/banner/banner-1.webp";
import Loader from "../components/Loader";

// Lazy load heavy PropertyList for faster first paint
const PropertyList = lazy(() => import("./properties/PropertyList"));

// Reusable animation variants
const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const Home = memo(() => {
  const navigate = useNavigate();

  const handleAddProperty = () => {
    navigate("/properties/create");
  };

  return (
    <div className="w-full flex flex-col overflow-hidden">
      {/* HERO SECTION */}
      <section className="container mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        {/* Left Content */}
        <Motion.div
          className="flex-1 flex flex-col items-start text-left"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
            Find or List Your{" "}
            <span className="text-orange-500">Dream Property</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
            Browse thousands of verified listings or easily post your own — all
            within our trusted community.
          </p>

          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Button
              onClick={handleAddProperty}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Add Property
            </Button>
          </Motion.div>
        </Motion.div>

        {/* Right Banner Image */}
        <Motion.div
          className="flex-1 relative w-full  md:w-auto h-[270px] md:h-96 rounded-xl overflow-hidden shadow-lg"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <img
            src={banner}
            alt="Modern Apartment"
            className="w-full h-full object-fill object-center transition-transform duration-700 will-change-transform hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {/* Optional gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-tr from-black/10 to-transparent pointer-events-none"></div>
        </Motion.div>
      </section>

      {/* Lazy Loaded Property List */}
      <Suspense
        fallback={
          <Loader />
        }
      >
        <Motion.section
          className="container mx-auto px-6 md:px-12 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
        <PropertyList type="all" showFilter={true} showPagination={false} homePage={true} />
        </Motion.section>
        <Motion.section
          className="container mx-auto px-6 md:px-12 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <PropertyList type="rent"  showFilter={false} />
        </Motion.section>
        <Motion.section
          className="container mx-auto px-6 md:px-12 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <PropertyList type="sale"  showFilter={false} />
        </Motion.section>
        <Motion.section
          className="container mx-auto px-6 md:px-12 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <PropertyList type="buy"  showFilter={false} />
        </Motion.section>
      </Suspense>
    </div>
  );
});

export default Home;
