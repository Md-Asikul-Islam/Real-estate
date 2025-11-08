import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import InputField from "../../components/InputField";
import ImageUploader from "../../components/ImageUploader";
import Button from "../../components/Button";
import { uploadCloudinary } from "../../utils/uploadCloudinary";

// ✅ Zod schema
const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Price is required"),
  saleType: z.enum(["sale", "rent", "buy"]),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  balcony: z.coerce.number().optional(),
  area: z.coerce.number().optional(),
  address: z.object({
    houseNo: z.string().optional(),
    roadNo: z.string().optional(),
    block: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().optional(),
  }),
  images: z.any().optional(),
});

const PropertyEdit = () => {
  const { id: propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, control } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      saleType: "sale",
      bedrooms: "",
      bathrooms: "",
      balcony: "",
      area: "",
      address: {
        houseNo: "",
        roadNo: "",
        block: "",
        city: "",
        postalCode: "",
      },
      images: [],
    },
  });

  // ✅ Fetch property once
  useEffect(() => {
    if (!propertyId) return;

    const controller = new AbortController();

    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${propertyId}`, {
          signal: controller.signal,
        });

        const data = res.data?.data || {};
        const addr = data.address || {};

        setProperty(data);
        reset({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          saleType: data.saleType || "sale",
          bedrooms: data.bedrooms || "",
          bathrooms: data.bathrooms || "",
          balcony: data.balcony || "",
          area: data.area || "",
          address: {
            houseNo: addr.houseNo || "",
            roadNo: addr.roadNo || "",
            block: addr.block || "",
            city: addr.city || "",
            postalCode: addr.postalCode || "",
          },
          images: [],
        });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Fetch failed:", err);
          toast.error("Failed to load property data");
        }
      }
    };

    fetchProperty();

    return () => controller.abort();
  }, [propertyId, reset]);

  // ✅ Form submit handler
  const onSubmit = async (data) => {
    toast.dismiss();

    startTransition(async () => {
      try {
        const oldImages = property?.images || [];
        const hasNewImages = data.images && data.images.length > 0;

        // 1️⃣ Update text fields
        await api.patch(`/properties/${propertyId}`, {
          ...data,
          images: undefined,
        });
        toast.success("Property info updated!");

        // 2️⃣ Handle images
        if (hasNewImages) {
          const oldPublicIds = oldImages.map((img) => img.public_id).filter(Boolean);

          if (oldPublicIds.length > 0) {
            await api.patch(`/properties/${propertyId}/images`, {
              deleteImages: oldPublicIds,
              newImages: [],
            });
          }

          const uploadResults = await Promise.allSettled(
            data.images.map((file) => uploadCloudinary(file, "properties"))
          );

          const uploadedImages = uploadResults
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value);

          if (uploadedImages.length > 0) {
            await api.patch(`/properties/${propertyId}/images`, {
              newImages: uploadedImages,
              deleteImages: [],
            });
          }

          setProperty((prev) => ({
            ...prev,
            images: uploadedImages,
          }));
        }

        toast.success("Property updated successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Property update failed!");
      }
    });
  };

  // ✅ Show loading while fetching
  if (!property) return <p className="text-center mt-10">Loading property...</p>;

  return (
    <div className="max-w-2xl mx-auto my-10 p-8">
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
        Edit Property
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField label="Title" type="text" {...register("title")} />

        <label className="block mb-2 font-semibold text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full px-4 py-3 bg-white text-gray-700 rounded-xl outline-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 focus:ring-opacity-30"
        />

        <InputField label="Price" type="number" {...register("price")} />

        <label className="block mb-2 font-semibold text-gray-700">
          Choose Your Property Type
        </label>
        <select
          {...register("saleType")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 focus:ring-opacity-30"
        >
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="buy">To Buy</option>
        </select>

        <p className="text-green-500 font-medium text-xl">Home Features</p>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Bedrooms" type="number" {...register("bedrooms")} />
          <InputField label="Bathrooms" type="number" {...register("bathrooms")} />
          <InputField label="Balcony" type="number" {...register("balcony")} />
          <InputField label="Area (sqft)" type="number" {...register("area")} />
        </div>

        <p className="text-green-500 font-medium text-xl">Address</p>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="House No" type="text" {...register("address.houseNo")} />
          <InputField label="Road No" type="text" {...register("address.roadNo")} />
          <InputField label="Block" type="text" {...register("address.block")} />
          <InputField label="City" type="text" {...register("address.city")} />
        </div>

        <InputField
          label="Postal Code"
          type="text"
          {...register("address.postalCode")}
        />

        <Controller
          name="images"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ImageUploader value={value} onChange={onChange} multiple maxFiles={5} />
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Property"}
        </Button>
      </form>
    </div>
  );
};

export default PropertyEdit;
