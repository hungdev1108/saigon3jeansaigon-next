import apiClient from "./config";

/**
 * Automation API endpoints
 */
const automationApi = {
  /**
   * Lấy toàn bộ dữ liệu automation (cho frontend)
   * @returns {Promise} Promise object với dữ liệu automation
   */
  getAutomationData: async () => {
    try {
      const response = await apiClient.get("/api/automation/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching automation data:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả automation items
   * @returns {Promise} Promise object với danh sách automation items
   */
  getItems: async () => {
    try {
      const response = await apiClient.get("/api/automation/items");
      return response.data;
    } catch (error) {
      console.error("Error fetching automation items:", error);
      throw error;
    }
  },

  /**
   * Cập nhật automation items
   * @param {Array} items - Danh sách automation items
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateItems: async (items) => {
    try {
      const response = await apiClient.put("/api/automation/items", {
        items,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating automation items:", error);
      throw error;
    }
  },

  /**
   * Cập nhật cài đặt trang automation
   * @param {Object} settings - Cài đặt trang (title, description, SEO)
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updatePageSettings: async (settings) => {
    try {
      const response = await apiClient.put("/api/automation/settings", settings);
      return response.data;
    } catch (error) {
      console.error("Error updating page settings:", error);
      throw error;
    }
  },

  // Legacy support - giữ method cũ để không break existing code
  Load: async () => {
    try {
      const response = await apiClient.get("/api/automation/items");
      return response.data;
    } catch (error) {
      console.error("Error fetching automation data:", error);
      throw error;
    }
  },
};

export default automationApi;