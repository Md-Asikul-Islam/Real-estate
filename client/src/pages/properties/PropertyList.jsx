// src/pages/properties/PropertyList.jsx
import React, { useMemo } from "react";
import useProperties from "../../hooks/useProperties";
import PropertyCard from "../properties/PropertyCard";
import PropertyFilter from "../properties/PropertyFilter";
import Pagination from "../properties/Pagination";
import Loader from "../../components/Loader";

const PropertyList = ({ type = "all", showFilter = true,   showPagination = true }) => {
  // pass route-based type (all/buy/rent/sale)
  const {
    properties,
    meta,
    filters,
    actions,
    isLoading,
    isFetching,
    isError,
    error,
  } = useProperties(type);

  // safe defaults
  const { limit = 12, page = 1 } = filters;
  const total = meta?.total ?? 0;
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // Initial (first) load: show centered page loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader message="Fetching latest properties..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-red-600">
        <p className="text-lg font-medium">Failed to load properties.</p>
        <p className="mt-2 text-sm text-gray-600">
          {error?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl py-5 font-semibold mb-6 text-gray-800">
        Latest Properties
        {type !== "all" && (
          <span className="capitalize text-primary ml-2">({type})</span>
        )}
      </h2>
      {showFilter && <PropertyFilter filters={filters} actions={actions} />}
      {/* Grid with subtle overlay when refetching */}
      <div className="relative mt-6">
        {/* overlay when background fetching (doesn't block old UI) */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 pointer-events-none">
            <Loader />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No properties found. Try adjusting filters.
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      {showPagination && totalPages > 1 &&  (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => actions.updateParams("page", p)}
            loading={isFetching}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyList;
