// src/components/PropertyCard.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Button from "../../components/Button";
import PropertyDetails from "../properties/PropertyDetails";

const PropertyCard = ({ property, showActions = false, onDelete, onEdit }) => {
  const { title, price, images, address, saleType } = property;
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef(null); // optional, kept if you need referencing
  const previouslyFocused = useRef(null);

  const saleTypeColor = {
    buy: "bg-blue-100 text-blue-700",
    rent: "bg-green-100 text-green-700",
    sale: "bg-red-100 text-red-700",
  };

  // Utility: get scrollbar width to prevent layout shift when locking body scroll
  const getScrollbarWidth = () =>
    window.innerWidth - document.documentElement.clientWidth;

  // Lock/unlock body scroll and compensate for scrollbar width
  useEffect(() => {
    if (showModal) {
      // save focus to restore later
      previouslyFocused.current = document.activeElement;

      const scrollBarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      if (scrollBarWidth) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      // ensure focus moves into the modal for accessibility
      // small timeout to wait for modal to mount
      setTimeout(() => {
        const modal = document.querySelector("#property-modal");
        if (modal) modal.focus();
      }, 0);
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      // restore focus
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    }

    // cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [showModal]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  return (
    <>
      <Motion.div
        ref={cardRef}
        className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col cursor-pointer relative"
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 10px 20px rgba(0,0,0,0.12)",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowModal(true);
        }}
      >
        {/* Image */}
        <div className="relative w-full h-48 sm:h-56 md:h-64">
          <img
            src={images?.[0]?.url || "https://via.placeholder.com/800x600"}
            alt={title || "Property image"}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {saleType && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 rounded text-sm font-medium ${saleTypeColor[saleType]}`}
            >
              {saleType.toUpperCase()}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <h2 className="font-semibold text-gray-700 text-lg sm:text-xl truncate">
            {title}
          </h2>

          {address?.city && (
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <IoLocationSharp className="text-green-600 text-base sm:text-lg" />
              <span className="truncate">{address.city}</span>
            </div>
          )}

          <p className="text-gray-800 font-bold text-lg sm:text-xl my-2">
            ৳ {price?.toLocaleString?.() ?? price}
          </p>

          {showActions ? (
            <div className="flex gap-2 mt-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property._id);
                }}
              >
                Edit
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property._id);
                }}
                variant="danger"
              >
                Delete
              </Button>
            </div>
          ) : (
            <Button className="mt-2">Book Now</Button>
          )}
        </div>
      </Motion.div>

      {/* Modal (centered, accessible, animated) */}
      <AnimatePresence>
        {showModal && (
          <Motion.div
            key="backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Modal content wrapper */}
            <Motion.div
              id="property-modal"
              tabIndex={-1}
              className="relative z-10 mx-4 w-full max-w-3xl rounded-2xl shadow-2xl bg-white overflow-hidden max-h-[90vh] ring-1 ring-black/5"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.995 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              // prevent backdrop click closing when clicking inside
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button row */}
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={() => setShowModal(false)}
                  aria-label="Close property details"
                  className="rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  ✕
                </button>
              </div>

              {/* Actual details component */}
              <div className="px-4 pb-6">
                <PropertyDetails
                  property={property}
                  onClose={() => setShowModal(false)}
                  isOwnerView={showActions} // ✅ Owner view prop
                  onEdit={onEdit}           // ✅ Pass handlers
                  onDelete={onDelete}
                />
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyCard;
