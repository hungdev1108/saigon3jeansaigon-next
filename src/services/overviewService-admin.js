import { BACKEND_DOMAIN } from '@/api/config';

class OverviewAdminService {
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
   * Lấy tất cả dữ liệu overview cho admin
   */
  async getCompleteOverviewData() {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/data`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || "Failed to fetch overview data");
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật banner
   */
  async updateBanner(formData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/banner`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating banner:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload hình ảnh cho banner
   */
  async uploadBannerImage(file) {
    try {
      const formData = new FormData();
      formData.append("bannerImage", file);

      // COMMENTED FOR DEVELOPMENT - Tạm comment để không cần token
      // const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      const headers = {};
      // if (token) {
      //   headers.Authorization = `Bearer ${token}`;
      // }

      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/banner`,
        {
          method: "PUT",
          headers,
          body: formData,
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading banner image:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật milestones
   */
  async updateMilestones(milestonesData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/milestones`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ milestones: milestonesData }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating milestones:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Thêm milestone mới
   */
  async addMilestone(milestoneData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/milestones`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(milestoneData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding milestone:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa milestone
   */
  async deleteMilestone(milestoneId) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/milestones/${milestoneId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting milestone:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload hình ảnh cho milestone
   */
  async uploadMilestoneImage(milestoneId, file) {
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
        `${BACKEND_DOMAIN}/api/overview/milestones/${milestoneId}/image`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading milestone image:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật milestones với hình ảnh
   */
  async updateMilestonesWithImages(formData) {
    try {
      // COMMENTED FOR DEVELOPMENT - Tạm comment để không cần token
      // const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      const headers = {};
      // if (token) {
      //   headers.Authorization = `Bearer ${token}`;
      // }

      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/milestones`,
        {
          method: "PUT",
          headers,
          body: formData,
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating milestones with images:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật CEO message
   */
  async updateMessage(messageData, isFormData = false) {
    try {
      let options;
      if (isFormData) {
        options = {
          method: "PUT",
          body: messageData // FormData
        };
      } else {
        options = {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(messageData)
        };
      }
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/message`,
        options
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating CEO message:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload hình ảnh cho CEO message
   */
  async uploadMessageImage(file) {
    try {
      const formData = new FormData();
      formData.append("ceoImage", file);

      // COMMENTED FOR DEVELOPMENT - Tạm comment để không cần token
      // const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      const headers = {};
      // if (token) {
      //   headers.Authorization = `Bearer ${token}`;
      // }

      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/message`,
        {
          method: "PUT",
          headers,
          body: formData,
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading message image:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật vision/mission
   */
  async updateVisionMission(visionMissionData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/vision-mission`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(visionMissionData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating vision/mission:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật core values
   */
  async updateCoreValues(coreValuesData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/core-values`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ values: coreValuesData }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating core values:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Thêm core value mới
   */
  async addCoreValue(coreValueData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/core-values`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(coreValueData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding core value:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa core value
   */
  async deleteCoreValue(coreValueId) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/core-values/${coreValueId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting core value:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật SEO data
   */
  async updateSeoData(seoData) {
    try {
      const response = await fetch(
        `${BACKEND_DOMAIN}/api/overview/seo`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(seoData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating SEO data:", error);
      return { success: false, message: error.message };
    }
  }
}

const overviewAdminService = new OverviewAdminService();
export default overviewAdminService; 