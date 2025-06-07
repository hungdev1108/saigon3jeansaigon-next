import axios from 'axios';
import { BACKEND_DOMAIN, API_CONFIG } from '../utils/setting';

const axiosInstance = axios.create({
    baseURL: BACKEND_DOMAIN,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ContactService = {
    async LoadContactInfo() {
        try {
            const response = await axiosInstance.get('api/contact/info');
            return response.data;
        } catch (error) {
            console.error('Error fetching info:', error);
            throw error;
        }
    },

    async createSubmission(name:string, company:string, email:string, phone:string, subject:string, message:string) {
        try {
            const submissionData = {
                name,
                company,
                email,
                phone,
                subject,
                message
            };
            const response = await axiosInstance.post('api/contact/submit', submissionData);
            return response.data;
        } catch (error) {
            console.error('Error fetching submit:', error);
            throw error;
        }
    },

};