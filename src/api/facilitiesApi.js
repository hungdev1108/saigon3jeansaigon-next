import apiClient from "./config";

/**
 * Facilities API endpoints
 */
const facilitiesApi = {
  /**
   * Lấy toàn bộ dữ liệu facilities (cho frontend)
   * @returns {Promise} Promise object với dữ liệu facilities
   */
  getFacilitiesData: async () => {
    try {
      const response = await apiClient.get("/api/facilities/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching facilities data:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả key metrics
   * @returns {Promise} Promise object với danh sách key metrics
   */
  getKeyMetrics: async () => {
    try {
      const response = await apiClient.get("/api/facilities/metrics");
      return response.data;
    } catch (error) {
      console.error("Error fetching key metrics:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả facility features
   * @returns {Promise} Promise object với danh sách facility features
   */
  getFacilityFeatures: async () => {
    try {
      const response = await apiClient.get("/api/facilities/features");
      return response.data;
    } catch (error) {
      console.error("Error fetching facility features:", error);
      throw error;
    }
  },

  /**
   * Cập nhật key metrics
   * @param {Array} metrics - Danh sách key metrics
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateKeyMetrics: async (metrics) => {
    try {
      const response = await apiClient.put("/api/facilities/metrics", {
        metrics,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating key metrics:", error);
      throw error;
    }
  },

  /**
   * Thêm key metric mới
   * @param {Object} metricData - Dữ liệu key metric mới
   * @returns {Promise} Promise object với kết quả thêm mới
   */
  addKeyMetric: async (metricData) => {
    try {
      const response = await apiClient.post(
        "/api/facilities/metrics",
        metricData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding key metric:", error);
      throw error;
    }
  },

  /**
   * Cập nhật facility features
   * @param {Array} features - Danh sách facility features
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateFacilityFeatures: async (features) => {
    try {
      const response = await apiClient.put("/api/facilities/features", {
        features,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating facility features:", error);
      throw error;
    }
  },

  /**
   * Thêm facility feature mới
   * @param {FormData} formData - Form data chứa thông tin feature và ảnh
   * @returns {Promise} Promise object với kết quả thêm mới
   */
  addFacilityFeature: async (formData) => {
    try {
      const response = await apiClient.post(
        "/api/facilities/features",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding facility feature:", error);
      throw error;
    }
  },

  /**
   * Cập nhật cài đặt trang facilities
   * @param {Object} settings - Cài đặt trang (title, description, SEO)
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updatePageSettings: async (settings) => {
    try {
      const response = await apiClient.put(
        "/api/facilities/settings",
        settings
      );
      return response.data;
    } catch (error) {
      console.error("Error updating page settings:", error);
      throw error;
    }
  },
};

export default facilitiesApi;
