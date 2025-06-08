import contactApi from '../api/contactApi';
import {BACKEND_DOMAIN} from '../api/config';

class ContactService {

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
    
    async LoadContactInfo() {
        try {
            return await contactApi.LoadContactInfo();
        } catch (error) {
            console.error('Error fetching info:', error);
            throw error;
        }
    }

    async createSubmission(name, company, email, phone, subject, message) {
        try {
            const submissionData = {
                name,
                company,
                email,
                phone,
                subject,
                message
            };
            return await contactApi.createSubmission(submissionData);
        } catch (error) {
            console.error('Failed to create submission', error);
            throw error;
        }
    }
};

const contactService = new ContactService();
export default contactService;