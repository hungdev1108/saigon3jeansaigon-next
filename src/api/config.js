// src/api/config.js - Fix để sử dụng environment variables
import axios from "axios";

// ✅ Sử dụng environment variables thay vì hardcode
const getBackendURL = () => {
// Ưu tiên env variable, fallback về hardcode
if (process.env.NEXT_PUBLIC_BACKEND_DOMAIN) {
// Remove /api suffix nếu có
return process.env.NEXT_PUBLIC_BACKEND_DOMAIN.replace('/api', '');
}

// Fallback dựa trên environment
if (process.env.NODE_ENV === 'production') {
return 'https://saigon3jean.com';
} else {
return 'http://localhost:3007'; // 🔥 Sửa từ 5001 thành 3007 (port backend thực tế)
}
};

const BACKEND_URL = getBackendURL();

// Backend URL: BACKEND_URL (debug removed)

const config = {
development: {
baseURL: BACKEND_URL,
timeout: 300000
},
production: {
baseURL: BACKEND_URL,
timeout: 300000
}
};

const environment = process.env.NODE_ENV || 'development';

export const API_CONFIG = config[environment];

// ✅ Base URL cho API - CONSISTENT với image paths
export const BACKEND_DOMAIN = BACKEND_URL;

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
baseURL: BACKEND_DOMAIN,
timeout: API_CONFIG.timeout,
headers: {
"Content-Type": "application/json",
},
});

// Request/Response interceptors (debug removed)
apiClient.interceptors.response.use(
(response) => response,
(error) => {
  console.error("API Error:", error.message);
  return Promise.reject(error);
}
);

export default apiClient;