import { BACKEND_DOMAIN } from "../api/config";

/**
 * Admin service cho eco-friendly
 */
class EcoFriendlyAdminService {
  /**
   * Lấy header cho việc upload file
   */
  getUploadHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Lấy toàn bộ dữ liệu eco-friendly
   */
  async getCompleteData() {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/data`, {
        headers: this.getUploadHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching eco-friendly data:", error);
      return { success: false, message: "Failed to fetch data" };
    }
  }

  /**
   * Cập nhật thông tin trang
   */
  async updatePageInfo(info) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/settings`, {
        method: 'PUT',
        headers: {
          ...this.getUploadHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating page info:", error);
      return { success: false, message: "Failed to update page info" };
    }
  }

  /**
   * Cập nhật hero section
   */
  async updateHero(formData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/hero`, {
        method: 'PUT',
        headers: this.getUploadHeaders(),
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating hero:", error);
      return { success: false, message: "Failed to update hero" };
    }
  }

  /**
   * Cập nhật ảnh chính
   */
  async updateMainImage(formData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/main-image`, {
        method: 'PUT',
        headers: this.getUploadHeaders(),
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating main image:", error);
      return { success: false, message: "Failed to update main image" };
    }
  }

  /**
   * Thêm feature mới
   */
  async addFeature(featureData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/features`, {
        method: 'POST',
        headers: {
          ...this.getUploadHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(featureData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding feature:", error);
      return { success: false, message: "Failed to add feature" };
    }
  }

  /**
   * Cập nhật feature
   */
  async updateFeature(featureId, updateData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/features/${featureId}`, {
        method: 'PUT',
        headers: {
          ...this.getUploadHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating feature:", error);
      return { success: false, message: "Failed to update feature" };
    }
  }

  /**
   * Xóa feature
   */
  async deleteFeature(featureId) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/features/${featureId}`, {
        method: 'DELETE',
        headers: this.getUploadHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting feature:", error);
      return { success: false, message: "Failed to delete feature" };
    }
  }

  /**
   * Thêm section mới
   */
  async addSection(formData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/sections`, {
        method: 'POST',
        headers: this.getUploadHeaders(),
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding section:", error);
      return { success: false, message: "Failed to add section" };
    }
  }

  /**
   * Cập nhật section
   */
  async updateSection(sectionId, formData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/sections/${sectionId}`, {
        method: 'PUT',
        headers: this.getUploadHeaders(),
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating section:", error);
      return { success: false, message: "Failed to update section" };
    }
  }

  /**
   * Xóa section
   */
  async deleteSection(sectionId) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/sections/${sectionId}`, {
        method: 'DELETE',
        headers: this.getUploadHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting section:", error);
      return { success: false, message: "Failed to delete section" };
    }
  }

  /**
   * Cập nhật SEO
   */
  async updateSeo(seoData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/seo`, {
        method: 'PUT',
        headers: {
          ...this.getUploadHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seoData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating SEO:", error);
      return { success: false, message: "Failed to update SEO" };
    }
  }
}

export default new EcoFriendlyAdminService(); 