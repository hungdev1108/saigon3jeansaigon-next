import apiClient from "./config";

const recruitmentApi = {

    load: async() => {
        try {
            const response = await apiClient.get('api/careers/jobs');
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    loadContactHr: async () => {
        try {
            const response = await apiClient.get('api/careers/contact-hr');
            return response.data;
        } catch (error) {
            console.error('Error fetching contact-hr:', error);
            throw error;
        }
    },

    loadCompanyInfo: async () => {
        try {
            const response = await apiClient.get('api/careers/company-info');
            return response.data;
        } catch (error) {
            console.error('Error fetching company-info:', error);
            throw error;
        }
    },

    ApplyJob: async (jobId, formData) => {
        try {

            await apiClient.post(`api/careers/jobs/${jobId}/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return true;
        } catch (error) {
            console.error('Error Apply jobs:', error);
            throw error;
        }
    }
}

export default recruitmentApi;