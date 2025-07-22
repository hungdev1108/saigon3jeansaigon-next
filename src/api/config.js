import axios from "axios";

export const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";

const apiClient = axios.create({
  baseURL: BACKEND_DOMAIN,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
