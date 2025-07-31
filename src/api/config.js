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
return 'http://localhost:5001';
}
};

const BACKEND_URL = getBackendURL();

console.log('🔧 Backend URL:', BACKEND_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔧 Env variable:', process.env.NEXT_PUBLIC_BACKEND_DOMAIN);

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

// Debug logging
apiClient.interceptors.request.use(
(config) => {
console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
return config;
},
(error) => {
return Promise.reject(error);
}
);

// Response interceptor
apiClient.interceptors.response.use(
(response) => {
console.log(`✅ API Response: ${response.status} ${response.config.url}`);
return config;
},
(error) => {
return Promise.reject(error);
}
);

// Response interceptor
apiClient.interceptors.response.use(
(response) => {
console.log(`✅ API Response: ${response.status} ${response.config.url}`);
return response;
},
(error) => {
console.error("❌ API Error:", {
url: error.config?.url,
baseURL: error.config?.baseURL,
status: error.response?.status,
message: error.message
});
return Promise.reject(error);
}
);

export default apiClient;