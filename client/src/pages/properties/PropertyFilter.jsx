import React from "react";
import { IoIosSearch } from "react-icons/io";
import Sort from "../../components/Sort";

const PropertyFilter = ({ filters, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      {/* Search Input */}
      <div className="flex items-center w-full sm:max-w-lg bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500 transition">
        <input
          type="text"
          placeholder="Search by title, city, or sale type..."
          value={filters.query}
          onChange={(e) => actions.updateParams("q", e.target.value)}
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <IoIosSearch className="text-gray-500 text-xl ml-2 flex-shrink-0" />
      </div>

      {/* Sort Dropdown */}
      <Sort
        value={filters.sort}
        onChange={(val) => actions.updateParams("sort", val)}
      />
    </div>
  );
};

export default PropertyFilter;
