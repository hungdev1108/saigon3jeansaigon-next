import apiClient from "./config";

/**
 * Eco Friendly API endpoints
 */
const ecoFriendlyApi = {
  /**
   * Lấy toàn bộ dữ liệu eco-friendly (cho frontend)
   * @returns {Promise} Promise object với dữ liệu eco-friendly
   */
  getEcoFriendlyData: async () => {
    try {
      const response = await apiClient.get("/api/eco-friendly/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching eco-friendly data:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả features
   * @returns {Promise} Promise object với danh sách features
   */
  getFeatures: async () => {
    try {
      const response = await apiClient.get("/api/eco-friendly/features");
      return response.data;
    } catch (error) {
      console.error("Error fetching features:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả sections
   * @returns {Promise} Promise object với danh sách sections
   */
  getSections: async () => {
    try {
      const response = await apiClient.get("/api/eco-friendly/sections");
      return response.data;
    } catch (error) {
      console.error("Error fetching sections:", error);
      throw error;
    }
  },

  /**
   * Cập nhật cài đặt trang eco-friendly
   * @param {Object} settings - Cài đặt trang (title, description, SEO)
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updatePageSettings: async (settings) => {
    try {
      const response = await apiClient.put("/api/eco-friendly/settings", settings);
      return response.data;
    } catch (error) {
      console.error("Error updating page settings:", error);
      throw error;
    }
  },

  /**
   * Cập nhật features
   * @param {Array} features - Danh sách features
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateFeatures: async (features) => {
    try {
      const response = await apiClient.put("/api/eco-friendly/features", {
        features,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating features:", error);
      throw error;
    }
  },

  /**
   * Cập nhật sections
   * @param {Array} sections - Danh sách sections
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateSections: async (sections) => {
    try {
      const response = await apiClient.put("/api/eco-friendly/sections", {
        sections,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating sections:", error);
      throw error;
    }
  },
};

export default ecoFriendlyApi;
