import apiClient from "./config";

const contactApi = {

    LoadContactInfo: async () => {
        try {
            const response = await apiClient.get("api/contact/info");
            return response.data;
        } catch (error) {
            console.error("Error fetching contact data:", error);
            throw error;
        }
    },

    createSubmission: async (submissionData) => {
        try {
            const response = await apiClient.post('api/contact/submit', submissionData);
            return response.data;
        } catch (error) {
            console.error("Error fetching contact data:", error);
            throw error;
        }
    },
}

export default contactApi;