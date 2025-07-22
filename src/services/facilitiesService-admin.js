const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

class FacilitiesAdminService {
  /**
   * Lấy header có authorization token
   */
  getAuthHeaders() {
    // COMMENTED FOR DEVELOPMENT - Tạm comment để không cần token
    // const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    return {
      "Content-Type": "application/json",
      // ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Lấy tất cả dữ liệu facilities cho admin
   */
  async getCompleteFacilitiesData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || "Failed to fetch facilities data");
      }
    } catch (error) {
      console.error("Error fetching facilities data:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật page title và description
   */
  async updatePageInfo(pageInfo) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/settings`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(pageInfo),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating page info:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật key metrics
   */
  async updateKeyMetrics(metrics) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/metrics`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ metrics }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating key metrics:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Thêm key metric mới
   */
  async addKeyMetric(metric) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/metrics`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(metric),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding key metric:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa key metric
   */
  async deleteKeyMetric(metricId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/metrics/${metricId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting key metric:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật facility features
   */
  async updateFacilityFeatures(features) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ features: features }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating facility features:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Thêm facility feature mới
   */
  async addFacilityFeature(feature) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(feature),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding facility feature:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa facility feature
   */
  async deleteFacilityFeature(featureId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features/${featureId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting facility feature:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload hình ảnh cho facility feature
   */
  async uploadFeatureImage(featureId, file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      // COMMENTED FOR DEVELOPMENT - Tạm comment để không cần token
      // const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      const headers = {};
      // if (token) {
      //   headers.Authorization = `Bearer ${token}`;
      // }

      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features/${featureId}`,
        {
          method: "PUT",
          headers,
          body: formData,
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading feature image:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Thêm nhiều ảnh cho facility feature
   */
  async addFeatureImages(featureId, files) {
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features/${featureId}/images`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading feature images:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa ảnh khỏi facility feature
   */
  async deleteFeatureImage(featureId, imageIndex) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features/${featureId}/images/${imageIndex}`,
        {
          method: 'DELETE',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting feature image:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Sắp xếp lại thứ tự ảnh
   */
  async reorderFeatureImages(featureId, newOrder) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features/${featureId}/images/reorder`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ newOrder }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error reordering feature images:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật SEO data
   */
  async updateSeoData(seoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities/settings`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(seoData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating SEO data:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload nhiều ảnh cho facility feature (trả về mảng url)
   */
  async uploadMultipleImages(formData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities/features/images/upload-multiple`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return { success: false, message: error.message };
    }
  }
}

const facilitiesAdminService = new FacilitiesAdminService();
export default facilitiesAdminService;
