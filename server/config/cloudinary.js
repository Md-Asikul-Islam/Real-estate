import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

//  Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Upload function
 const uploadCloudinary = async (filePath, folder = "properties") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // auto detects image/video
    });
    return result; // contains secure_url, public_id, etc.
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw new Error("Image upload failed");
  }
};

// Delete function (optional)
 const destroyCloudinaryImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted Cloudinary image: ${publicId}`);
  } catch (error) {
    console.error("Failed to delete Cloudinary image:", error.message);
  }
};

export {uploadCloudinary, destroyCloudinaryImage }