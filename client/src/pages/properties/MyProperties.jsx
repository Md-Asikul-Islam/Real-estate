import React, { useState } from "react";
import useMyProperties from "../../hooks/useMyProperties";
import PropertyCard from "../properties/PropertyCard";
import Pagination from "../properties/Pagination";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const MyProperties = () => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, deleteProperty } = useMyProperties(page, limit);
  const { properties = [], meta = {} } = data || {};
  const { totalPages = 1 } = meta;
  const navigate = useNavigate();
const handleDelete = (id) => {
    deleteProperty(id, {
      onSuccess: () => toast.success("Property deleted successfully!"),
      onError: () => toast.error("Failed to delete property."),
    });
  };

  const handleUpdate = (id) => {
    navigate(`/properties/edit/${id}`);
  };

  if (isLoading) return <Loader message="Loading your properties..." />;

  if (!properties.length)
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <p className="text-gray-500 text-lg mb-4">No properties found.</p>
        <button
          onClick={() => navigate("/properties/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
        >
          Add New Property
        </button>
      </div>
    );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader message="Loading your properties..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">
        My Properties
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            showActions={true}
            isOwnerView ={true}
            onDelete={() => handleDelete(property._id)}
            onEdit={() => handleUpdate(property._id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}
    </div>
  );
};

export default MyProperties;
