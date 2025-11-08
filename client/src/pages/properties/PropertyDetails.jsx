import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import {
  MdBedroomParent,
  MdBathtub,
  MdSquareFoot,
  MdBalcony,
} from "react-icons/md";
import Button from "../../components/Button";

/**
 * PropertyDetails — styled for PropertyCard modal
 * Works seamlessly with accessibility + scroll lock features
 */
const PropertyDetails = ({ property, onClose, isOwnerView }) => {
  if (!property) return null;

  const { title, price, address, bedrooms, bathrooms, balcony, area, images, description } =
    property;

  // ✅ Address Formatter
  const formatAddress = (addr) => {
    if (!addr) return "No address available";
    return [
      addr.houseNo && `House ${addr.houseNo}`,
      addr.roadNo && `Road ${addr.roadNo}`,
      addr.block && `Block ${addr.block}`,
      addr.city && addr.city,
      addr.postalCode && `Postal Code: ${addr.postalCode}`,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 🖼 Image Gallery */}
      <div className="flex overflow-x-auto gap-2 mb-2 scrollbar-thin scrollbar-thumb-gray-300">
        {images?.length ? (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`${title} ${idx}`}
              className="h-48 w-auto rounded-lg shrink-0 object-cover"
            />
          ))
        ) : (
          <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
            No Image Available
          </div>
        )}
      </div>

      {/* 🏷 Title + Price */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          {address && (
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <IoLocationSharp className="text-green-600" />
              <span className="text-sm sm:text-base">{formatAddress(address)}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-800">
            ৳ {price?.toLocaleString?.() ?? price}
          </p>
          <p className="text-sm text-gray-500">
            {bedrooms ?? "-"} Beds • {bathrooms ?? "-"} Baths
          </p>
        </div>
      </div>

      {/* 🧱 Features */}
      {(bedrooms || bathrooms || balcony || area) && (
        <div>
          <h3 className="font-semibold mb-2 text-gray-800">Home Features</h3>
          <div className="flex flex-wrap gap-4 text-gray-700">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <MdBedroomParent className="text-gray-600 text-xl" />
                <span>{bedrooms} Bedrooms</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <MdBathtub className="text-gray-600 text-xl" />
                <span>{bathrooms} Bathrooms</span>
              </div>
            )}
            {balcony && (
              <div className="flex items-center gap-1">
                <MdBalcony className="text-gray-600 text-xl" />
                <span>{balcony} Balcony</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1">
                <MdSquareFoot className="text-gray-600 text-xl" />
                <span>{area} sqft</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📜 Description */}
      {description && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Description</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/*  Actions */}
   <div className="flex items-center justify-between gap-3 pt-2">
  {isOwnerView ? (
    <>
      <Button width="">Edit</Button>
      <Button width="" variant="danger" >Delete</Button>
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
      >
        Close
      </button>
    </>
  ) : (
    <>
      <Button width="">Book Now</Button>
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
      >
        Close
      </button>
    </>
  )}
</div>

    </div>
  );
};

export default PropertyDetails;
