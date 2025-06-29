import apiClient from "./config";

/**
 * Overview API endpoints
 */
const overviewApi = {
  /**
   * Lấy toàn bộ dữ liệu overview (cho frontend)
   * @returns {Promise} Promise object với dữ liệu overview
   */
  getOverviewData: async () => {
    try {
      const response = await apiClient.get("/api/overview/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching overview data:", error);
      throw error;
    }
  },

  /**
   * Lấy banner data
   * @returns {Promise} Promise object với banner data
   */
  getBanner: async () => {
    try {
      const response = await apiClient.get("/api/overview/banner");
      return response.data;
    } catch (error) {
      console.error("Error fetching banner data:", error);
      throw error;
    }
  },

  /**
   * Lấy milestones data
   * @returns {Promise} Promise object với milestones data
   */
  getMilestones: async () => {
    try {
      const response = await apiClient.get("/api/overview/milestones");
      return response.data;
    } catch (error) {
      console.error("Error fetching milestones data:", error);
      throw error;
    }
  },

  /**
   * Lấy CEO message data
   * @returns {Promise} Promise object với message data
   */
  getMessage: async () => {
    try {
      const response = await apiClient.get("/api/overview/message");
      return response.data;
    } catch (error) {
      console.error("Error fetching message data:", error);
      throw error;
    }
  },

  /**
   * Lấy vision/mission data
   * @returns {Promise} Promise object với vision/mission data
   */
  getVisionMission: async () => {
    try {
      const response = await apiClient.get("/api/overview/vision-mission");
      return response.data;
    } catch (error) {
      console.error("Error fetching vision/mission data:", error);
      throw error;
    }
  },

  /**
   * Lấy core values data
   * @returns {Promise} Promise object với core values data
   */
  getCoreValues: async () => {
    try {
      const response = await apiClient.get("/api/overview/core-values");
      return response.data;
    } catch (error) {
      console.error("Error fetching core values data:", error);
      throw error;
    }
  },

  /**
   * Cập nhật banner
   * @param {Object} bannerData - Dữ liệu banner
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateBanner: async (bannerData) => {
    try {
      const response = await apiClient.put("/api/overview/banner", bannerData);
      return response.data;
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  },

  /**
   * Cập nhật milestones
   * @param {Array} milestonesData - Dữ liệu milestones
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateMilestones: async (milestonesData) => {
    try {
      const response = await apiClient.put("/api/overview/milestones", {
        milestones: milestonesData,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating milestones:", error);
      throw error;
    }
  },

  /**
   * Cập nhật CEO message
   * @param {Object} messageData - Dữ liệu message
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateMessage: async (messageData) => {
    try {
      const response = await apiClient.put("/api/overview/message", messageData);
      return response.data;
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  },

  /**
   * Cập nhật vision/mission
   * @param {Object} visionMissionData - Dữ liệu vision/mission
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateVisionMission: async (visionMissionData) => {
    try {
      const response = await apiClient.put("/api/overview/vision-mission", visionMissionData);
      return response.data;
    } catch (error) {
      console.error("Error updating vision/mission:", error);
      throw error;
    }
  },

  /**
   * Cập nhật core values
   * @param {Array} coreValuesData - Dữ liệu core values
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateCoreValues: async (coreValuesData) => {
    try {
      const response = await apiClient.put("/api/overview/core-values", {
        coreValues: coreValuesData,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating core values:", error);
      throw error;
    }
  },
};

export default overviewApi;
