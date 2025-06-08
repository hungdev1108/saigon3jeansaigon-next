import automationApi from '../api/automationApi';
import {BACKEND_DOMAIN} from '../api/config';
class AutomationService {

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

    async Load() {
        try {
            return await automationApi.Load();
        } catch (error) {
            console.error(
                "FacilitiesService - Error getting complete facilities data:",
                error
            );
        }
    }
};

const automationService = new AutomationService();
export default automationService;