import apiClient from "./config";

/**
 * Machinery API endpoints
 */
const machineryApi = {
  /**
   * Lấy toàn bộ dữ liệu machinery (cho frontend)
   * @returns {Promise} Promise object với dữ liệu machinery
   */
  getMachineryData: async () => {
    try {
      const response = await apiClient.get("/api/machinery/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching machinery data:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả stages
   * @returns {Promise} Promise object với danh sách stages
   */
  getStages: async () => {
    try {
      const response = await apiClient.get("/api/machinery/stages");
      return response.data;
    } catch (error) {
      console.error("Error fetching stages:", error);
      throw error;
    }
  },

  /**
   * Lấy machines theo stage
   * @param {number} stageNumber - Số thứ tự stage
   * @returns {Promise} Promise object với danh sách machines
   */
  getMachinesByStage: async (stageNumber) => {
    try {
      const response = await apiClient.get(
        `/api/machinery/stages/${stageNumber}/machines`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching machines by stage:", error);
      throw error;
    }
  },

  /**
   * Cập nhật stages
   * @param {Array} stages - Danh sách stages
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateStages: async (stages) => {
    try {
      const response = await apiClient.put("/api/machinery/stages", {
        stages,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating stages:", error);
      throw error;
    }
  },

  /**
   * Thêm stage mới
   * @param {Object} stageData - Dữ liệu stage mới
   * @returns {Promise} Promise object với kết quả thêm mới
   */
  addStage: async (stageData) => {
    try {
      const response = await apiClient.post("/api/machinery/stages", stageData);
      return response.data;
    } catch (error) {
      console.error("Error adding stage:", error);
      throw error;
    }
  },

  /**
   * Thêm machine mới vào stage
   * @param {number} stageNumber - Số thứ tự stage
   * @param {FormData} formData - Form data chứa thông tin machine và ảnh
   * @returns {Promise} Promise object với kết quả thêm mới
   */
  addMachine: async (stageNumber, formData) => {
    try {
      const response = await apiClient.post(
        `/api/machinery/stages/${stageNumber}/machines`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding machine:", error);
      throw error;
    }
  },

  /**
   * Cập nhật machine
   * @param {string} machineId - ID của machine
   * @param {FormData} formData - Form data chứa thông tin machine và ảnh
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateMachine: async (machineId, formData) => {
    try {
      const response = await apiClient.put(
        `/api/machinery/machines/${machineId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating machine:", error);
      throw error;
    }
  },

  /**
   * Xóa machine
   * @param {string} machineId - ID của machine
   * @returns {Promise} Promise object với kết quả xóa
   */
  deleteMachine: async (machineId) => {
    try {
      const response = await apiClient.delete(
        `/api/machinery/machines/${machineId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting machine:", error);
      throw error;
    }
  },

  /**
   * Cập nhật cài đặt trang machinery
   * @param {Object} settings - Cài đặt trang (title, description, SEO)
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updatePageSettings: async (settings) => {
    try {
      const response = await apiClient.put("/api/machinery/settings", settings);
      return response.data;
    } catch (error) {
      console.error("Error updating page settings:", error);
      throw error;
    }
  },
};

export default machineryApi;
