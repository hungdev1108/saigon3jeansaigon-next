import { ecoFriendlyApi } from '../api';
import { BACKEND_DOMAIN } from '../api/config';

class EcoFriendlyService {
  fixImagePath(imagePath) {
    if (!imagePath) return "";

    // If already has http, keep as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // If starts with /uploads/, add base URL
    if (imagePath.startsWith("/uploads/")) {
      return `${BACKEND_DOMAIN}${imagePath}`;
    }

    // Fallback for old paths - all are converted to backend
    return `${BACKEND_DOMAIN}/${imagePath}`;
  }

  async getData() {
    try {
      const response = await ecoFriendlyApi.getData();
      
      if (response && response.data) {
        // Fix image paths
        if (response.data.hero && response.data.hero.image) {
          response.data.hero.image = this.fixImagePath(response.data.hero.image);
        }
        
        if (response.data.mainImage) {
          response.data.mainImage = this.fixImagePath(response.data.mainImage);
        }
        
        // Fix image paths in sections
        if (response.data.sections && Array.isArray(response.data.sections)) {
          response.data.sections = response.data.sections.map(section => ({
            ...section,
            image: this.fixImagePath(section.image)
          }));
        }
      }
      
      return response;
    } catch (error) {
      console.error("EcoFriendlyService - Error getting eco-friendly data:", error);
      throw error;
    }
  }
}

const ecoFriendlyService = new EcoFriendlyService();
export default ecoFriendlyService; 