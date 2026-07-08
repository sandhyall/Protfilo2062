// backend/middleware/uploadMiddleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"];

/**
 * Reusable factory for Cloudinary-backed multer uploaders.
 * Call this again for project images, resumes, etc. — just pass a new folder/fieldName.
 *
 * @param {Object} opts
 * @param {string} opts.folder - Cloudinary subfolder, e.g. "blog", "projects"
 * @param {string} opts.fieldName - form field name multer expects, e.g. "heroImage"
 * @param {number} [opts.maxSizeMB=5] - max upload size in MB
 */
const makeCloudinaryUploader = ({ folder, fieldName, maxSizeMB = 5 }) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `asliya/${folder}`, // change "asliya" to your preferred root folder name
      allowed_formats: ALLOWED_FORMATS,
      transformation: [{ quality: "auto" }],
    },
  });

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG or WebP images are allowed"), false);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  }).single(fieldName);
};

export const uploadBlogImage = makeCloudinaryUploader({
  folder: "blog",
  fieldName: "heroImage",
});