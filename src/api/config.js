import axios from "axios";

// Base URL cho API
export const BASE_URL = "http://localhost:5001";

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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
