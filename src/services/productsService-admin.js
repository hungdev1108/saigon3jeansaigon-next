import { BACKEND_DOMAIN } from '../api/config';

class ProductsAdminService {
  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      // Thêm Authorization nếu cần
    };
  }

  // Helper for API calls
  async _apiCall(endpoint, method = "GET", body = null, contentType = "application/json") {
    const options = {
      method,
      headers: this.getAuthHeaders(contentType),
    };
    if (body) {
      options.body = contentType === 'application/json' ? JSON.stringify(body) : body;
    }

    try {
      const response = await fetch(`${BACKEND_DOMAIN}${endpoint}`, options);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `${method} request to ${endpoint} failed`);
      return data;
    } catch (error) {
      console.error(`API call error: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  // ==================== PRODUCT MANAGEMENT ====================

  async getAllProducts(includeInactive = true) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/products?includeInactive=${includeInactive}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      return { success: false, message: error.message };
    }
  }

  async getProductById(productId) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/products/${productId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      return { success: false, message: error.message };
    }
  }
  
  async createProduct(formData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/products/admin`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      return { success: false, message: error.message };
    }
  }

  async updateProduct(productId, formData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/products/${productId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      return { success: false, message: error.message };
    }
  }

  deleteProduct(productId) {
    return this._apiCall(`/api/products/admin/${productId}`, 'DELETE');
  }

  toggleProductStatus(productId) {
    return this._apiCall(`/api/products/admin/${productId}/toggle-status`, 'PATCH');
  }
  
  async toggleFeaturedStatus(productId) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/products/admin/${productId}/toggle-featured`,
        {
          method: "PATCH",
          headers: this.getAuthHeaders(),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      return { success: false, message: error.message };
    }
  }

  reorderProducts(productIds) {
    return this._apiCall('/api/products/admin/reorder', 'PATCH', { productIds });
  }

  // ==================== GALLERY IMAGES ====================
  
  addGalleryImage(productId, formData) {
    return this._apiCall(`/api/products/admin/${productId}/gallery`, 'POST', formData, null);
  }
  
  updateGalleryImage(productId, imageId, imageAlt) {
    return this._apiCall(`/api/products/admin/${productId}/gallery/${imageId}`, 'PUT', { imageAlt });
  }

  deleteGalleryImage(productId, imageId) {
    return this._apiCall(`/api/products/admin/${productId}/gallery/${imageId}`, 'DELETE');
  }
  
  reorderGalleryImages(productId, imageIds) {
      return this._apiCall(`/api/products/admin/${productId}/gallery/reorder`, 'PATCH', { imageIds });
  }
  
  // ==================== FEATURES ====================
  
  addFeature(productId, featureData) {
      return this._apiCall(`/api/products/admin/${productId}/features`, 'POST', featureData);
  }

  updateFeature(productId, featureId, featureData) {
    return this._apiCall(`/api/products/admin/${productId}/features/${featureId}`, 'PUT', featureData);
  }

  deleteFeature(productId, featureId) {
    return this._apiCall(`/api/products/admin/${productId}/features/${featureId}`, 'DELETE');
  }
  
  reorderFeatures(productId, featureIds) {
      return this._apiCall(`/api/products/admin/${productId}/features/reorder`, 'PATCH', { featureIds });
  }

  // ==================== APPLICATIONS ====================
  
  addApplication(productId, applicationData) {
    return this._apiCall(`/api/products/${productId}/applications`, 'POST', applicationData);
  }

  updateApplication(productId, appId, applicationData) {
    return this._apiCall(`/api/products/${productId}/applications/${appId}`, 'PUT', applicationData);
  }
  
  deleteApplication(productId, appId) {
    console.log(`Deleting application with productId=${productId}, appId=${appId}`);
    return this._apiCall(`/api/products/${productId}/applications/${appId}`, 'DELETE');
  }
  
  reorderApplications(productId, applicationIds) {
      return this._apiCall(`/api/products/${productId}/applications/reorder`, 'PATCH', { applicationIds });
  }

  // ==================== APPLICATION IMAGES ====================
  
  addApplicationImage(productId, appId, formData) {
      return this._apiCall(`/api/products/${productId}/applications/${appId}/images`, 'POST', formData, null);
  }
  
  updateApplicationImage(productId, appId, imageId, imageAlt) {
      return this._apiCall(`/api/products/${productId}/applications/${appId}/images/${imageId}`, 'PUT', { imageAlt });
  }
  
  deleteApplicationImage(productId, appId, imageId) {
      return this._apiCall(`/api/products/${productId}/applications/${appId}/images/${imageId}`, 'DELETE');
  }
  
  reorderApplicationImages(productId, appId, imageIds) {
      return this._apiCall(`/api/products/${productId}/applications/${appId}/images/reorder`, 'PATCH', { imageIds });
  }

  // ==================== UPLOAD MULTIPLE IMAGES ====================
  
  async uploadMultipleImages(formData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/upload/multiple`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: error.message };
    }
  }
}

const productsAdminService = new ProductsAdminService();
export default productsAdminService; 