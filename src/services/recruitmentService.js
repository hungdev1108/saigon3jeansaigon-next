import recruitmentApi from '@/api/recruitmentApi';
import {BACKEND_DOMAIN} from '../api/config';

class RecruitmentService {

    fixImagePath(imagePath) {
        if (!imagePath) return "";
    
        // Nếu đã có http thì giữ nguyên
        if (imagePath.startsWith("http")) {
          return imagePath;
        }
    
        // Nếu đã có /uploads/ thì thêm base URL
        if (imagePath.startsWith("/uploads/")) {
          return `${BACKEND_DOMAIN}/${imagePath}`;
        }
    
        // Fallback cho đường dẫn cũ - tất cả đều chuyển về backend
        return `${BACKEND_DOMAIN}/${imagePath}`;
    }

    async load() {
        try {
            return await recruitmentApi.load();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    async loadContactHr() {
        try {
            return await recruitmentApi.loadContactHr();
        } catch (error) {
            console.error('Error fetching contact-hr:', error);
            throw error;
        }
    }

    async loadCompanyInfo() {
        try {
            return await recruitmentApi.loadCompanyInfo();
        } catch (error) {
            console.error('Error fetching company-info:', error);
            throw error;
        }
    }

    async ApplyJob(jobId, fullName, email, phone, address, cvFile) {
        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('cv', cvFile);

            return await recruitmentApi.ApplyJob(jobId, formData);

        } catch (error) {
            console.error('Error Apply jobs:', error);
            throw error;
        }
    }
};

const recruitmentService = new RecruitmentService();
export default recruitmentService;