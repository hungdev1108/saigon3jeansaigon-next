import axios from "axios";

const config = {
  development: {
    baseURL: 'http://localhost:5001',
    timeout: 30000
  },
  production: {
    baseURL: 'https://saigon3jeansaigon.com',
    timeout: 30000
  }
};

const environment = process.env.NODE_ENV || 'development';

export const API_CONFIG = config[environment];

// Base URL cho API
export const BACKEND_DOMAIN = config[environment].baseURL;

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: BACKEND_DOMAIN,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Có thể thêm token authentication ở đây nếu cần
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi chung
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
