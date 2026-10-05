import apiClient from "./config";

const ecoFriendlyApi = {
  getData: async () => {
    try {
      const response = await apiClient.get("api/eco-friendly/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching eco-friendly data:", error);
      throw error;
    }
  }
};

export default ecoFriendlyApi; 