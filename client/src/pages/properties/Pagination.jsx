import React from "react";
import Loader from "../../components/Loader";

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  if (!totalPages) return null; // 0 হলে না দেখাবে

  const pages = [...Array(totalPages).keys()].map((x) => x + 1);
  if(loading) return <Loader message="loading..." />
  return (
    <div className="flex gap-2 justify-center mt-6">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage} // disable current page
          className={`px-3 py-1 rounded ${
            page === currentPage ? "bg-blue-600 text-white " : "bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;