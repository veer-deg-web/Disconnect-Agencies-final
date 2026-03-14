import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryUploadResult = {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
};

/**
 * Uploads an image to Cloudinary.
 * @param file - File path, Buffer, or remote URL.
 * @param folder - Cloudinary folder name.
 * @returns The upload result.
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  folder: string = "blogs"
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "image" as const,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    };

    if (typeof file === "string") {
      // It's a URL or a file path
      cloudinary.uploader.upload(file, uploadOptions, (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result as CloudinaryUploadResult);
      });
    } else {
      // It's a Buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(file);
    }
  });
}

export default cloudinary;
