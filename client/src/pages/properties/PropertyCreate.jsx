import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import InputField from "../../components/InputField";
import ImageUploader from "../../components/ImageUploader";
import Button from "../../components/Button";
import { convertToWebp } from "../../utils/convertToWebp";
import { uploadCloudinary } from "../../utils/uplaodCloudinary";

/* ---------------- Validation Schema ---------------- */
const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Price is required"),
  saleType: z.enum(["sale", "rent", "buy"]).default("sale"),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  balcony: z.coerce.number().optional(),
  area: z.coerce.number().optional(),
  houseNo: z.string().optional(),
  roadNo: z.string().optional(),
  block: z.string().optional(),
  city: z.string().min(2, "City name is required"),
  postalCode: z.string().optional(),
  images: z.any().optional(),
});

/* ---------------- Component ---------------- */
const PropertyCreate = () => {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, control, reset } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: { images: [] },
  });

  const onSubmit = async (data) => {
    toast.dismiss();
    const toastId = toast.loading("Creating property...");

    try {
      //  Create property text info first
      const payload = {
        title: data.title,
        description: data.description,
        price: data.price,
        saleType: data.saleType,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        balcony: data.balcony,
        area: data.area,
        address: {
          houseNo: data.houseNo,
          roadNo: data.roadNo,
          block: data.block,
          city: data.city,
          postalCode: data.postalCode,
        },
      };

      const res = await api.post("/properties", payload);
      const propertyId = res?.data?.data?._id;
      toast.success("Property created successfully!", { id: toastId });

      //  Upload images in background
      if (data.images?.length && propertyId) {
        (async () => {
          try {
            //  Convert each image to WebP
            const webpFiles = await Promise.all(
              Array.from(data.images).map((file) => convertToWebp(file, 0.8))
            );
             // Upload converted WebP files to Cloudinary
            const uploads = await Promise.allSettled(
              webpFiles.map((file) => uploadCloudinary(file, "properties"))
            );
            
            const successUploads = uploads
              .filter((u) => u.status === "fulfilled")
              .map((u) => u.value);

            if (successUploads.length) {
              await api.patch(`/properties/${propertyId}/images`, {
                newImages: successUploads,
              });
              toast.success("Images uploaded successfully!");
            }
          } catch (error) {
            console.error(error);
            toast.error("Image upload failed.");
          }
        })();
      }

      //  Reset form
      startTransition(() => reset());
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Property creation failed", { id: toastId });
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 ">
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
        Create New Property
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Title"
          placeholder="Enter title"
          {...register("title")}
        />
        <label className="block mb-2 font-semibold text-gray-700">
          {" "}
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full px-4 py-3 bg-white backdrop-blur-sm text-gray-700 rounded-xl outline-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 focus:ring-opacity-30"
        />
        <InputField
          label="Price"
          type="number"
          placeholder="Enter price"
          {...register("price")}
        />
        <label className="block mb-2 font-semibold text-gray-700">
          {" "}
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

        
        <p className="text-green-500 font-medium text-xl text-[20px]">
          Home Features
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Bedrooms"
            type="number"
            {...register("bedrooms")}
          />
          <InputField
            label="Bathrooms"
            type="number"
            {...register("bathrooms")}
          />
          <InputField label="Balcony" type="number" {...register("balcony")} />
          <InputField label="Area (sqft)" type="number" {...register("area")} />
        </div>
        <p className="text-green-500 font-medium text-xl text-[20px]">Adress</p>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="House No" {...register("houseNo")} />
          <InputField label="Road No" {...register("roadNo")} />
          <InputField label="Block" {...register("block")} />
          <InputField label="City" {...register("city")} />
        </div>

        <InputField
          label="Postal Code"
          type="text"
          {...register("postalCode")}
        />

        <Controller
          name="images"
          control={control}
          render={({ field: { onChange } }) => (
            <ImageUploader onChange={onChange} multiple maxFiles={5} />
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Processing..." : "Create Property"}
        </Button>
      </form>
    </div>
  );
};

export default PropertyCreate;
