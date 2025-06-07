import axios from 'axios';
import { BACKEND_DOMAIN, API_CONFIG } from '../utils/setting';

const axiosInstance = axios.create({
    baseURL: BACKEND_DOMAIN,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const RecruitmentService = {
    async load() {
        try {
            const response = await axiosInstance.get('api/careers/jobs');
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    async loadContactHr() {
        try {
            const response = await axiosInstance.get('api/careers/contact-hr');
            return response.data;
        } catch (error) {
            console.error('Error fetching contact-hr:', error);
            throw error;
        }
    },
    async loadCompanyInfo() {
        try {
            const response = await axiosInstance.get('api/careers/company-info');
            return response.data;
        } catch (error) {
            console.error('Error fetching company-info:', error);
            throw error;
        }
    },

    async ApplyJob(jobId: any, fullName: string, email: string, phone: string, address: string, cvFile:File) {
        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('cv', cvFile);

            await axiosInstance.post(`api/careers/jobs/${jobId}/apply`, formData, {
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

};