import { BACKEND_DOMAIN } from "../api/config";

/**
 * Normalize URL path để tránh double slash
 * @param {string} url - URL cần normalize
 * @returns {string} URL đã được normalize
 */
function normalizeUrl(url) {
  // Replace multiple slashes with single slash, except for protocol://
  return url.replace(/([^:]\/)\/+/g, "$1");
}

/**
 * Fix đường dẫn hình ảnh từ API để đảm bảo URL đúng
 * @param {string} imagePath - Đường dẫn hình ảnh từ API
 * @returns {string} Đường dẫn đã được sửa
 */
export function fixImagePath(imagePath) {
  if (!imagePath) return "";

  // Clean input path
  const cleanPath = imagePath.trim();

  // Nếu là relative path và đã có /uploads/ thì thêm base URL
  if (cleanPath.startsWith("/uploads/")) {
    const result = normalizeUrl(`${BACKEND_DOMAIN}${cleanPath}`);
    return result;
  }

  // Nếu là relative path không có /uploads/ thì thêm /uploads/
  if (cleanPath.startsWith("/images/")) {
    const result = normalizeUrl(`${BACKEND_DOMAIN}/uploads${cleanPath}`);
    return result;
  }

  // Nếu đã có http/https
  if (cleanPath.startsWith("http")) {
    try {
      // Fix common URL malformation: thiếu slash sau port
      let fixedUrl = cleanPath;

      // Check for missing slash after port (e.g. http://domain:3007images/...)
      const portRegex = /(https?:\/\/[^\/]+):(\d+)([^\/])/;
      const portMatch = fixedUrl.match(portRegex);
      if (portMatch) {
        // Insert missing slash after port
        fixedUrl = fixedUrl.replace(portRegex, `$1:$2/$3`);
      }

      // Normalize trước để loại bỏ double slash
      const normalizedUrl = normalizeUrl(fixedUrl);
      const url = new URL(normalizedUrl);

      // Kiểm tra nếu path bắt đầu với /images/ mà không có /uploads/
      if (
        url.pathname.startsWith("/images/") &&
        !url.pathname.startsWith("/uploads/")
      ) {
        // Thêm /uploads vào đầu pathname
        url.pathname = `/uploads${url.pathname}`;
        const result = url.toString();
        return result;
      }

      return normalizedUrl;
    } catch (error) {
      console.error(`[ERROR] Invalid URL: "${cleanPath}"`, error);

      // Fix common patterns for malformed URLs
      if (
        cleanPath.includes("://") &&
        !cleanPath.match(/^https?:\/\/[^\/]+\//)
      ) {
        // Extract just the path part and treat as relative
        const pathMatch = cleanPath.match(/^https?:\/\/[^\/]+(.*)$/);
        if (pathMatch && pathMatch[1]) {
          const pathPart = pathMatch[1];
          if (pathPart.startsWith("images/")) {
            return normalizeUrl(`${BACKEND_DOMAIN}/uploads/${pathPart}`);
          }
        }
      }
    }
  }

  // Fallback: thêm base URL và /uploads/
  const relativePath = cleanPath.replace(/^\/+/, ""); // Remove leading slashes

  // Handle case where path might start with domain prefix that needs to be removed
  let cleanRelativePath = relativePath;
  const domainPattern = /^https?:\/\/[^\/]+\//;
  if (domainPattern.test(cleanRelativePath)) {
    cleanRelativePath = cleanRelativePath.replace(domainPattern, "");
  }

  // Remove any remaining protocol prefixes
  cleanRelativePath = cleanRelativePath.replace(/^https?:\/\/[^\/]*/, "");

  const result = normalizeUrl(`${BACKEND_DOMAIN}/uploads/${cleanRelativePath}`);
  return result;
}

// Keep existing functions unchanged
export function fixImagePaths(images) {
  if (!Array.isArray(images)) return [];
  return images.map(fixImagePath);
}

export function fixObjectImagePaths(
  obj,
  imageFields = ["image", "imageUrl", "src"]
) {
  if (!obj || typeof obj !== "object") return obj;

  const result = { ...obj };

  imageFields.forEach((field) => {
    if (result[field]) {
      result[field] = fixImagePath(result[field]);
    }
  });

  return result;
}
