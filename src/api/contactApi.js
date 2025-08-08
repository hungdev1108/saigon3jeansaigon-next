import apiClient from "./config";

/**
 * Contact API endpoints
 */
const contactApi = {
  /**
   * Lấy toàn bộ dữ liệu contact (cho frontend)
   * @returns {Promise} Promise object với dữ liệu contact
   */
  getContactData: async () => {
    try {
      const response = await apiClient.get("/api/contact/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching contact data:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin contact (Admin dashboard)
   * @returns {Promise} Promise object với thông tin contact
   */
  getContactInfo: async () => {
    try {
      const response = await apiClient.get("/api/contact/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching contact info:", error);
      throw error;
    }
  },

  /**
   * Tạo submission mới
   * @param {Object} submissionData - Dữ liệu submission
   * @returns {Promise} Promise object với kết quả tạo submission
   */
  createSubmission: async (submissionData) => {
    try {
      const response = await apiClient.post("/api/contact/submit", submissionData);
      return response.data;
    } catch (error) {
      console.error("Error creating submission:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin contact
   * @param {Object} contactData - Dữ liệu contact
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateContactInfo: async (contactData) => {
    try {
      const response = await apiClient.put("/api/contact/info", contactData);
      return response.data;
    } catch (error) {
      console.error("Error updating contact info:", error);
      throw error;
    }
  },

  /**
   * Cập nhật cài đặt trang contact
   * @param {Object} settings - Cài đặt trang (title, description, SEO)
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updatePageSettings: async (settings) => {
    try {
      const response = await apiClient.put("/api/contact/settings", settings);
      return response.data;
    } catch (error) {
      console.error("Error updating page settings:", error);
      throw error;
    }
  },

  // Legacy support - giữ method cũ để không break existing code
  LoadContactInfo: async () => {
    try {
      const response = await apiClient.get("/api/contact/info");
      return response.data;
    } catch (error) {
      console.error("Error fetching contact data:", error);
      throw error;
    }
  },
};

export default contactApi;