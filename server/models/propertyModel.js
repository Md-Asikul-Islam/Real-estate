import mongoose from "mongoose";
const { Schema } = mongoose;

/* ----------------------------- Image Schema ----------------------------- */
const ImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    key: { type: String, trim: true },
    alt: { type: String, trim: true, default: "Property image" },
  },
  { _id: false }
);

/* ----------------------------- Address Schema ----------------------------- */
const AddressSchema = new Schema(
  {
    houseNo: { type: String, trim: true },
    roadNo: { type: String, trim: true },
    block: { type: String, trim: true },
    city: { type: String, trim: true, required: true },
    postalCode: { type: String, trim: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
  },
  { _id: false }
);
/* ----------------------------- Property Schema ----------------------------- */
const PropertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    saleType: { type: String, enum: ["sale", "rent", "buy"], default: "sale" },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    balcony: { type: Number, default: 1 },
    area: { type: Number, min: 0 },
    address: { type: AddressSchema, required: true },
    images: [ImageSchema],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isPublished: { type: Boolean, default: true },
    slug: { type: String, index: true },
     imagesToDelete: [{ type: String }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);



/* ----------------------------- Index ----------------------------- */
PropertySchema.index({
  title: "text",
  description: "text",
  "address.city": "text",
  "address.block": "text",
  "address.roadNo": "text",
});
PropertySchema.index({ price: 1 });
PropertySchema.index({ saleType: 1 });
PropertySchema.index({ bedrooms: 1 });
PropertySchema.index({ createdAt: -1 });

/* ----------------------------- Slug Generator ----------------------------- */
PropertySchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});
// ‍  adding image after upload the cloudinary
PropertySchema.methods.addImages = async function (inputImages = []) {
  if (!Array.isArray(inputImages) || inputImages.length === 0) return; // skip if empty

  const formatted = inputImages.map((item) => {
    if (typeof item === "string") {
      // simple URL string
      return { url: item, public_id: null, key: null, alt: "Property image" };
    }

    return {
      url: item.url,
      public_id: item.public_id || null,   // use Cloudinary public_id if available
      key: item.key || item.public_id || null,
      alt: item.alt || "Property image",
    };
  });

  this.images.push(...formatted);
  await this.save();
};


/* ----------------------------- Virtual Field ----------------------------- */
PropertySchema.virtual("pricePerSqft").get(function () {
  return this.area ? this.price / this.area : null;
});
export default mongoose.model("Property", PropertySchema);
