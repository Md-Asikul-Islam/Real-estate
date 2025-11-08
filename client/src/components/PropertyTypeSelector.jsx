import React from "react";
import { Controller } from "react-hook-form";

const PropertyTypeSelector = ({ control }) => {
  const options = [
    { label: "For Sale", value: "sale", color: "bg-blue-100 text-blue-700" },
    { label: "For Rent", value: "rent", color: "bg-green-100 text-green-700" },
    { label: "To Buy", value: "buy", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <Controller
      name="saleType"
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className="flex gap-3 mt-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none
                ${value === option.value ? `${option.color} shadow-md scale-105` : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    />
  );
};

export default PropertyTypeSelector;
