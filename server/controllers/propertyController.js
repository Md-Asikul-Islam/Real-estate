import Property from "../models/propertyModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { destroyCloudinaryImage } from "../config/cloudinary.js";

/* Projection */
const PROPERTY_LIST_PROJECTION = {
  title: 1,
  slug: 1,
  price: 1,
  saleType: 1,
  bedrooms: 1,
  bathrooms: 1,
  balcony: 1,
  area: 1,
  images: { $slice: 1 },
  "address.city": 1,
  createdAt: 1,
  owner: 1,
};

/*
  @desc    Create a new property
  @route   POST /api/properties
  @access  Private
*/
const createProperty = asyncHandler(async (req, res, next) => {
  
  const {
    title,
    description,
    price,
    saleType,
    bedrooms,
    bathrooms,
    balcony,
    area,
    address,
  } = req.body;

  if (!title || !price || !saleType || !address?.city)
    return next(new AppError("Required fields missing", 400));

  const parsedAddress =
    typeof address === "string" ? JSON.parse(address) : address;

  const property = await Property.create({
    title,
    description,
    price,
    saleType,
    bedrooms,
    bathrooms,
    balcony,
    area,
    address: parsedAddress,
    images: [],
    owner: req.user._id,
    isPublished: true,
  });

  // Immediate response
  res.status(201).json({
    success: true,
    message: "Property created successfully!",
    data: property,
  });
});

/*
  @desc    Upload image cloudinary and auto update DB
  @route   POST /api/properties
  @access  Private
*/

 const uploadImages = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { newImages = [], deleteImages = [] } = req.body;

  const property = await Property.findById(id);
  if (!property) return next(new AppError("Property not found", 404));

  // Delete queued images 
  if (Array.isArray(deleteImages) && deleteImages.length > 0) {
    // Remove from property.images in DB
    property.images = property.images.filter(
      (img) => !deleteImages.includes(img.public_id)
    );

    // Queue for background deletion if needed
    property.imagesToDelete = [
      ...(property.imagesToDelete || []),
      ...deleteImages,
    ];

    // Delete immediately from Cloudinary in parallel
    await Promise.allSettled(
      deleteImages.map(async (public_id) => {
        try {
          await destroyCloudinaryImage(public_id);
        } catch (err) {
          console.warn(`Failed to delete Cloudinary image ${public_id}:`, err.message);
        }
      })
    );
  }

  // Add new uploaded images 
  if (Array.isArray(newImages) && newImages.length > 0) {
    // Ensure each image has url & public_id
    const formattedImages = newImages.map((img) => ({
      url: img.url || img, // fallback to string if just URL passed
      public_id: img.public_id, // must be passed from frontend upload response
      alt: img.alt || "Property image",
    }));

    property.images.push(...formattedImages);
  }

  await property.save();

  res.status(200).json({
    success: true,
    message: "Images updated successfully!",
    data: property,
  });
});
/*
  @desc   Clean up all unused images from Cloudinary
          - Deletes images listed in `imagesToDelete` queue
          - Clears the queue after deletion
  @access Private / Internal (used by cron job or background worker)
*/

const cleanOldImages = asyncHandler(async () => {
  const properties = await Property.find({
    imagesToDelete: { $exists: true, $ne: [] },
  });

  for (const prop of properties) {
    const toDelete = prop.imagesToDelete || [];

    // Delete all queued images in parallel
    await Promise.allSettled(
      toDelete.map(async (public_id) => {
        try {
          await destroyCloudinaryImage(public_id);
        } catch (err) {
          console.error("Failed to delete Cloudinary image:", public_id, err.message);
        }
      })
    );

    // Clear the queue and save
    prop.imagesToDelete = [];
    await prop.save({ validateBeforeSave: false });
  }
});
  
/*
  @desc    Update an existing property by ID
  @route   PATCH /api/properties/:id
  @access  Private
*/
const updateProperty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const property = await Property.findById(id);
  if (!property) return next(new AppError("Property not found", 404));

  Object.assign(property, updates);
  await property.save();

  res.json({
    success: true,
    message: "Property updated successfully!",
    data: property,
  });
});

/*
  @desc    Delete a property by ID
  @route   DELETE /api/properties/:id
  @access  Private
*/

const deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) return next(new AppError("Property not found", 404));

  const isOwner = property.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin")
    return next(new AppError("Not authorized", 403));

  // Queue all images for deletion
  property.imagesToDelete = property.images.map((i) => i.public_id);
  await property.deleteOne();

  res.json({ success: true, message: "Property deleted successfully!" });
});

/*
  @desc   GET all properties
  @route   GET /api/properties
  @access  Public
*/
const getAllProperties = asyncHandler(async (req, res) => {
  const {
    search = "",
    minPrice,
    maxPrice,
    bedrooms,
    sort,
    page = 1,
    limit = 10,
    saleType,
  } = req.query;

  const query = { isPublished: true };
  const validSaleTypes = ["rent", "buy", "sale"];

  // 🔹 Filter by saleType
  if (saleType && validSaleTypes.includes(saleType)) {
    query.saleType = saleType;
  }

  // 🔹 Text search
  if (search.trim()) {
    query.$text = { $search: search };
  }

  // 🔹 Bedrooms filter
  if (bedrooms && !isNaN(bedrooms)) {
    query.bedrooms = { $gte: Number(bedrooms) };
  }

  // 🔹 Price filter
  if ((minPrice && !isNaN(minPrice)) || (maxPrice && !isNaN(maxPrice))) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 🔹 Pagination
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(50, Number(limit));
  const skip = (safePage - 1) * safeLimit;

  // 🔹 Sorting
  const sortBy =
    sort === "priceAsc"
      ? { price: 1 }
      : sort === "priceDesc"
      ? { price: -1 }
      : { createdAt: -1 };

  // 🔹 Aggregation pipeline
  const pipeline = [
    { $match: query },
    { $sort: sortBy },
    { $skip: skip },
    { $limit: safeLimit },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    { $project: { __v: 0, "owner._id": 0, "owner.password": 0 } },
  ];

  // 🔹 Execute data + total count in parallel
  const [data, totalCount] = await Promise.all([
    Property.aggregate(pipeline),
    Property.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    meta: {
      total: totalCount,
      count: data.length,
      page: safePage,
      totalPages: Math.ceil(totalCount / safeLimit),
    },
    data,
  });
});


/*
  @desc    Get all properties uploaded by logged-in user
  @route   GET /api/properties/my
  @access  Private
*/
const getMyProperties = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Number(req.query.limit) || 8);
  const skip = (page - 1) * limit;

  const [result] = await Property.aggregate([
    { $match: { owner: req.user._id } },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          { $project: { __v: 0 } }
        ],
        total: [{ $count: "count" }]
      }
    }
  ]);

  const properties = result?.data || [];
  const total = result?.total?.[0]?.count || 0;

  res.json({
    success: true,
    count: properties.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: properties,
  });
});




/*
  @desc    Get a single property by ID
  @route   GET /api/properties/:id
  @access  Public
*/

const getPropertyById = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id)
    .populate("owner", "userName email -_id")
    .lean();

  if (!property) return next(new AppError("Property not found", 404));

  res.json({ success: true, data: property });
});

/*
  @desc    Toggle publish/unpublish status of a property by ID
  @route   PATCH /api/properties/:id/publish
  @access  Private
*/

const togglePublish = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) return next(new AppError("Property not found", 404));

  property.isPublished = !property.isPublished;
  await property.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: `Property ${
      property.isPublished ? "published" : "unpublished"
    } successfully`,
    data: property,
  });
});

export {
  createProperty,
  uploadImages,
  cleanOldImages,
  getAllProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  togglePublish,
};
