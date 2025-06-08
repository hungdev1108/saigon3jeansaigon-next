import axios from 'axios';
import { BACKEND_DOMAIN, API_CONFIG } from '../utils/setting';

const axiosInstance = axios.create({
    baseURL: BACKEND_DOMAIN,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const AutomationService = {
    async Load() {
        try {
            const response = await axiosInstance.get('api/automation/items');
            return response.data;
        } catch (error) {
            console.error('Error fetching automation:', error);
            throw error;
        }
    },

};