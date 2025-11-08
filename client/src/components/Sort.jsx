import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Sort = ({ value, onChange }) => {
  const options = [
    { label: "Price: Low → High", value: "priceAsc" },
    { label: "Price: High → Low", value: "priceDesc" },
    { label: "Newest Listings", value: "newest" },
    { label: "Oldest Listings", value: "oldest" },
  ];

  const [open, setOpen] = useState(false);
  const ref = useRef();
  const currentLabel = options.find((opt) => opt.value === value)?.label || "Sort By";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full sm:w-56">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 bg-white border border-gray-300 rounded-sm shadow-sm hover:bg-gray-50 transition"
      >
        <span className="truncate">{currentLabel}</span>
        <IoIosArrowDown className="ml-2 text-gray-500" />
      </button>

      {/* Dropdown Options */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition ${
                value === opt.value ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sort;
