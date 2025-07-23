import { BACKEND_DOMAIN } from '@/api/config';

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
      const response = await fetch(`${BACKEND_DOMAIN}/api/facilities`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Raw API response:", data);
        
        // Đảm bảo rằng mỗi feature đều có _id
        if (data.data && data.data.facilityFeatures && Array.isArray(data.data.facilityFeatures)) {
          data.data.facilityFeatures = data.data.facilityFeatures.map(feature => {
            // Nếu có _id nhưng không có id, gán id = _id
            if (feature._id && !feature.id) {
              feature.id = feature._id;
            }
            // Nếu có id nhưng không có _id, gán _id = id
            if (!feature._id && feature.id) {
              feature._id = feature.id;
            }
            return feature;
          });
        }
        
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
        `${BACKEND_DOMAIN}/api/facilities/settings`,
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
        `${BACKEND_DOMAIN}/api/facilities/metrics`,
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
        `${BACKEND_DOMAIN}/api/facilities/metrics`,
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
        `${BACKEND_DOMAIN}/api/facilities/metrics/${metricId}`,
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
        `${BACKEND_DOMAIN}/api/facilities/features`,
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
      console.log('Adding facility feature:', feature);

      // Đảm bảo trường image luôn có giá trị
      if (!feature.image && feature.images && feature.images.length > 0) {
        feature.image = feature.images[0].url;
      }

      const response = await fetch(
        `${BACKEND_DOMAIN}/api/facilities/features`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(feature),
        }
      );

      const data = await response.json();
      console.log('Add facility feature response:', data);
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
      if (!featureId) {
        throw new Error("Feature ID is required");
      }
      
      console.log("Deleting feature with ID:", featureId);
      // Lấy ra id thực (nếu là object ID)
      const id = typeof featureId === 'object' && featureId._id ? featureId._id : featureId;
      console.log("Processed ID for API call:", id);
      
      // Kiểm tra backend API có sẵn sàng không
      try {
        const checkResponse = await fetch(`${BACKEND_DOMAIN}/api/facilities/features`, {
          method: "GET",
        });
        
        if (!checkResponse.ok) {
          console.error("Backend API check failed:", checkResponse.status, checkResponse.statusText);
        } else {
          console.log("Backend API available. Proceeding with delete operation");
        }
      } catch (checkError) {
        console.error("Error checking backend API:", checkError);
      }
      
      // Thực hiện xóa với ID đã kiểm tra
      console.log(`Sending DELETE request to ${BACKEND_DOMAIN}/api/facilities/features/${id}`);
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/facilities/features/${id}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("Delete response status:", response.status, response.statusText);
      
      const data = await response.json().catch(e => {
        console.error("Error parsing response JSON:", e);
        return { success: false, message: "Could not parse response" };
      });
      
      console.log("Delete API response data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: Failed to delete facility feature`);
      }
      
      return data;
    } catch (error) {
      console.error("Error deleting facility feature:", error);
      return { success: false, message: error.message || "Lỗi không xác định khi xóa facility feature" };
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
        `${BACKEND_DOMAIN}/api/facilities/features/${featureId}`,
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
        `${BACKEND_DOMAIN}/api/facilities/features/${featureId}/images`,
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
        `${BACKEND_DOMAIN}/api/facilities/features/${featureId}/images/${imageIndex}`,
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
        `${BACKEND_DOMAIN}/api/facilities/features/${featureId}/images/reorder`,
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
      const response = await fetch(`${BACKEND_DOMAIN}/api/facilities/settings`, {
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
      console.log("Uploading multiple images");
      
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/facilities/features/images/upload-multiple`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Upload error response:", errorData);
        throw new Error(`Upload failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Upload response:", data);
      
      // Check if data.urls is an array before returning
      if (!data.urls || !Array.isArray(data.urls)) {
        console.error("Invalid response format, urls array missing:", data);
        return {
          success: false,
          message: 'Invalid response format from server'
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return { success: false, message: error.message };
    }
  }
}

const facilitiesAdminService = new FacilitiesAdminService();
export default facilitiesAdminService;
