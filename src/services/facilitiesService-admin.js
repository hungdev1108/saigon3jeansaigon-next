const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
      const response = await fetch(`${API_BASE_URL}/api/admin/facilities`, {
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
        `${API_BASE_URL}/api/admin/facilities/page-info`,
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
        `${API_BASE_URL}/api/admin/facilities/key-metrics`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ keyMetrics: metrics }),
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
        `${API_BASE_URL}/api/admin/facilities/key-metrics`,
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
        `${API_BASE_URL}/api/admin/facilities/key-metrics/${metricId}`,
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
        `${API_BASE_URL}/api/admin/facilities/features`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ facilityFeatures: features }),
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
        `${API_BASE_URL}/api/admin/facilities/features`,
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
        `${API_BASE_URL}/api/admin/facilities/features/${featureId}`,
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
        `${API_BASE_URL}/api/admin/facilities/features/${featureId}/image`,
        {
          method: "POST",
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
   * Cập nhật SEO data
   */
  async updateSeoData(seoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/facilities/seo`, {
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
}

const facilitiesAdminService = new FacilitiesAdminService();
export default facilitiesAdminService;
