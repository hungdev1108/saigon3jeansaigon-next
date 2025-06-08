import apiClient from "./config";

const automationApi = {

    Load: async () => {
        try {
            const response = await apiClient.get("api/automation/items");
            return response.data;
        } catch (error) {
            console.error("Error fetching automation data:", error);
            throw error;
        }
    }
}

export default automationApi;