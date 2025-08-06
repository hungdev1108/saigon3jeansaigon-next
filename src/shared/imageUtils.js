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
 * Tạo các phiên bản tối ưu của hình ảnh (origin, webp, medium, thumbnail)
 * @param {string} imageUrl - URL của hình ảnh gốc
 * @returns {Object} Các URL của các phiên bản hình ảnh
 */
export function getOptimizedImageUrls(imageUrl) {
  if (!imageUrl) return { origin: "" };
  
  // Debug log trước khi fix
  console.log("getOptimizedImageUrls - Original URL:", imageUrl);
  
  // Fix đường dẫn hình ảnh
  const fixedUrl = fixImagePath(imageUrl);
  
  // Debug log sau khi fix
  console.log("getOptimizedImageUrls - Fixed URL:", fixedUrl);
  
  // Tạo các phiên bản
  const origin = fixedUrl;
  let webp = "";
  let medium = "";
  let thumbnail = "";
  let low = "";
  
  try {
    // Kiểm tra nếu URL đã là webp
    if (fixedUrl.toLowerCase().endsWith('.webp')) {
      // Nếu đã là webp, thì dùng luôn cho các phiên bản
      webp = fixedUrl;
      
      // Kiểm tra nếu đã có -medium.webp hoặc -thumbnail.webp trong URL
      if (fixedUrl.includes('-medium.webp')) {
        medium = fixedUrl;
        // Tạo thumbnail từ medium
        thumbnail = fixedUrl.replace('-medium.webp', '-thumbnail.webp');
      } else if (fixedUrl.includes('-thumbnail.webp')) {
        thumbnail = fixedUrl;
        // Tạo medium từ thumbnail
        medium = fixedUrl.replace('-thumbnail.webp', '-medium.webp');
      } else {
        // Nếu là webp thường, tạo medium và thumbnail
        medium = fixedUrl.replace('.webp', '-medium.webp');
        thumbnail = fixedUrl.replace('.webp', '-thumbnail.webp');
      }
    } 
    // Nếu URL có dạng .jpg, .png, .jpeg thì tạo các phiên bản tối ưu
    else if (/\.(jpg|jpeg|png)$/i.test(fixedUrl)) {
      webp = fixedUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      medium = fixedUrl.replace(/\.(jpg|jpeg|png)$/i, '-medium.webp');
      thumbnail = fixedUrl.replace(/\.(jpg|jpeg|png)$/i, '-thumbnail.webp');
      low = fixedUrl.replace(/\.(jpg|jpeg|png)$/i, '-low.webp');
    } else {
      // Nếu không phải định dạng ảnh phổ biến, sử dụng URL gốc cho tất cả
      console.log('Unknown image format, using original URL for all versions:', fixedUrl);
      webp = fixedUrl;
      medium = fixedUrl;
      thumbnail = fixedUrl;
      low = fixedUrl;
    }
    
    // Kiểm tra xem các phiên bản có tồn tại không
    console.log('Image URLs:', {
      origin,
      webp,
      medium,
      thumbnail,
      low
    });
  } catch (error) {
    console.error('Error in getOptimizedImageUrls:', error);
    // Fallback to origin for all versions
    webp = origin;
    medium = origin;
    thumbnail = origin;
    low = origin;
  }
  
  return {
    origin,
    webp,
    medium,
    thumbnail,
    low
  };
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
  
  // Log đường dẫn gốc để debug
  console.log("fixImagePath - Original path:", cleanPath);

  // Nếu là relative path và đã có /uploads/ thì thêm base URL
  if (cleanPath.startsWith("/uploads/")) {
    // Kiểm tra xem BACKEND_DOMAIN có kết thúc bằng / không
    const domain = BACKEND_DOMAIN.endsWith('/') 
      ? BACKEND_DOMAIN.slice(0, -1) // Bỏ dấu / cuối nếu có
      : BACKEND_DOMAIN;
    
    const result = normalizeUrl(`${domain}${cleanPath}`);
    console.log("fixImagePath - Fixed uploads path:", result);
    return result;
  }
  
  // Xử lý đường dẫn từ thư mục automation - có thể có nhiều định dạng
  if (cleanPath.includes("/automation/") || cleanPath.includes("/images/automation/")) {
    console.log("Detected automation path:", cleanPath);
    
    const domain = BACKEND_DOMAIN.endsWith('/') 
      ? BACKEND_DOMAIN.slice(0, -1)
      : BACKEND_DOMAIN;
    
    // Nếu đường dẫn đã có /uploads/ thì không thêm nữa
    if (cleanPath.includes("/uploads/")) {
      const result = normalizeUrl(`${domain}${cleanPath}`);
      console.log("fixImagePath - Fixed automation path with uploads:", result);
      return result;
    } else {
      // Nếu không có /uploads/ thì thêm vào
      const result = normalizeUrl(`${domain}/uploads${cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath}`);
      console.log("fixImagePath - Fixed automation path without uploads:", result);
      return result;
    }
  }

  // Nếu là relative path không có /uploads/ thì thêm /uploads/
  if (cleanPath.startsWith("/images/")) {
    // Kiểm tra xem BACKEND_DOMAIN có kết thúc bằng / không
    const domain = BACKEND_DOMAIN.endsWith('/') 
      ? BACKEND_DOMAIN.slice(0, -1) // Bỏ dấu / cuối nếu có
      : BACKEND_DOMAIN;
      
    const result = normalizeUrl(`${domain}/uploads${cleanPath}`);
    console.log("fixImagePath - Fixed images path:", result);
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

      console.log("fixImagePath - Normalized URL:", normalizedUrl);
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
            const fixedUrl = normalizeUrl(`${BACKEND_DOMAIN}/uploads/${pathPart}`);
            console.log("fixImagePath - Fixed malformed URL:", fixedUrl);
            return fixedUrl;
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

  // Kiểm tra xem BACKEND_DOMAIN có kết thúc bằng / không
  const domain = BACKEND_DOMAIN.endsWith('/') 
    ? BACKEND_DOMAIN.slice(0, -1) // Bỏ dấu / cuối nếu có
    : BACKEND_DOMAIN;

  const result = normalizeUrl(`${domain}/uploads/${cleanRelativePath}`);
  console.log("fixImagePath - Fallback result:", result);
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
