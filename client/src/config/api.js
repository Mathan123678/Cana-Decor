// Centralized API configuration for local dev and hosting

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

/**
 * Normalizes image URLs for local uploads and external/Cloudinary URLs.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/")) {
    return `${SERVER_URL}${imagePath}`;
  }
  return `${SERVER_URL}/uploads/${imagePath}`;
};
