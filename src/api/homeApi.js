import apiClient from "./config";

/**
 * Lấy tất cả dữ liệu cho trang home
 * @returns {Promise} Promise chứa dữ liệu home
 */
export const getHomeData = async () => {
  try {
    const response = await apiClient.get("/api/home/data");
    return response.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu hero section
 * @returns {Promise} Promise chứa dữ liệu hero
 */
export const getHeroData = async () => {
  try {
    const response = await apiClient.get("/api/home/hero");
    return response.data;
  } catch (error) {
    console.error("Error fetching hero data:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu sections (3 cards)
 * @returns {Promise} Promise chứa dữ liệu sections
 */
export const getHomeSections = async () => {
  try {
    const response = await apiClient.get("/api/home/sections");
    return response.data;
  } catch (error) {
    console.error("Error fetching home sections:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu customers
 * @returns {Promise} Promise chứa dữ liệu customers
 */
export const getCustomers = async () => {
  try {
    const response = await apiClient.get("/api/home/customers");
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu certifications
 * @returns {Promise} Promise chứa dữ liệu certifications
 */
export const getCertifications = async () => {
  try {
    const response = await apiClient.get("/api/home/certifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching certifications:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu news
 * @returns {Promise} Promise chứa dữ liệu news
 */
export const getNews = async () => {
  try {
    const response = await apiClient.get("/api/home/news");
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu contact section trên trang home
 * @returns {Promise} Promise chứa dữ liệu contact section
 */
export const getHomeContact = async () => {
  try {
    const response = await apiClient.get("/api/home/contact-section");
    return response.data;
  } catch (error) {
    console.error("Error fetching home contact section:", error);
    throw error;
  }
};
