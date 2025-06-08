import apiClient from "./config";

/**
 * Products API endpoints
 */
const productsApi = {
  /**
   * Lấy toàn bộ dữ liệu products (cho frontend)
   * @returns {Promise} Promise object với dữ liệu products
   */
  getProductsData: async () => {
    try {
      const response = await apiClient.get("/api/products/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching products data:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả products
   * @returns {Promise} Promise object với danh sách products
   */
  getProducts: async () => {
    try {
      const response = await apiClient.get("/api/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Lấy product theo ID
   * @param {string} productId - ID của product
   * @returns {Promise} Promise object với thông tin product
   */
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  },

  /**
   * Lấy product theo slug
   * @param {string} slug - Slug của product
   * @returns {Promise} Promise object với thông tin product
   */
  getProductBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/api/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      throw error;
    }
  },

  /**
   * Thêm product mới
   * @param {Object} productData - Dữ liệu product mới
   * @returns {Promise} Promise object với kết quả thêm mới
   */
  addProduct: async (productData) => {
    try {
      const response = await apiClient.post("/api/products", productData);
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  /**
   * Cập nhật product
   * @param {string} productId - ID của product
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateProduct: async (productId, updateData) => {
    try {
      const response = await apiClient.put(
        `/api/products/${productId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  /**
   * Xóa product
   * @param {string} productId - ID của product
   * @returns {Promise} Promise object với kết quả xóa
   */
  deleteProduct: async (productId) => {
    try {
      const response = await apiClient.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  /**
   * Thêm hình ảnh vào gallery của product
   * @param {string} productId - ID của product
   * @param {FormData} formData - Form data chứa hình ảnh
   * @returns {Promise} Promise object với kết quả thêm hình ảnh
   */
  addProductImage: async (productId, formData) => {
    try {
      const response = await apiClient.post(
        `/api/products/${productId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding product image:", error);
      throw error;
    }
  },

  /**
   * Cập nhật hình ảnh trong gallery
   * @param {string} productId - ID của product
   * @param {string} imageId - ID của hình ảnh
   * @param {Object} updateData - Dữ liệu cập nhật hình ảnh
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateProductImage: async (productId, imageId, updateData) => {
    try {
      const response = await apiClient.put(
        `/api/products/${productId}/images/${imageId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product image:", error);
      throw error;
    }
  },

  /**
   * Xóa hình ảnh khỏi gallery
   * @param {string} productId - ID của product
   * @param {string} imageId - ID của hình ảnh
   * @returns {Promise} Promise object với kết quả xóa
   */
  deleteProductImage: async (productId, imageId) => {
    try {
      const response = await apiClient.delete(
        `/api/products/${productId}/images/${imageId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting product image:", error);
      throw error;
    }
  },

  /**
   * Sắp xếp lại thứ tự products
   * @param {Array} productIds - Mảng ID products theo thứ tự mới
   * @returns {Promise} Promise object với kết quả sắp xếp
   */
  reorderProducts: async (productIds) => {
    try {
      const response = await apiClient.put("/api/products/reorder", {
        productIds,
      });
      return response.data;
    } catch (error) {
      console.error("Error reordering products:", error);
      throw error;
    }
  },

  /**
   * Sắp xếp lại thứ tự hình ảnh trong gallery
   * @param {string} productId - ID của product
   * @param {Array} imageIds - Mảng ID hình ảnh theo thứ tự mới
   * @returns {Promise} Promise object với kết quả sắp xếp
   */
  reorderProductImages: async (productId, imageIds) => {
    try {
      const response = await apiClient.put(
        `/api/products/${productId}/images/reorder`,
        {
          imageIds,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error reordering product images:", error);
      throw error;
    }
  },

  /**
   * Cập nhật cài đặt carousel của product
   * @param {string} productId - ID của product
   * @param {Object} carouselSettings - Cài đặt carousel
   * @returns {Promise} Promise object với kết quả cập nhật
   */
  updateCarouselSettings: async (productId, carouselSettings) => {
    try {
      const response = await apiClient.put(
        `/api/products/${productId}/carousel`,
        carouselSettings
      );
      return response.data;
    } catch (error) {
      console.error("Error updating carousel settings:", error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết product cho trang product details
   * @param {string} productId - ID của product
   * @returns {Promise} Promise object với chi tiết product
   */
  getProductDetails: async (productId) => {
    try {
      const response = await apiClient.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết product theo slug cho trang product details
   * @param {string} slug - Slug của product
   * @returns {Promise} Promise object với chi tiết product
   */
  getProductDetailsBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/api/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details by slug:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê của product
   * @param {string} productId - ID của product
   * @returns {Promise} Promise object với thống kê product
   */
  getProductStats: async (productId) => {
    try {
      const response = await apiClient.get(`/api/products/${productId}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product stats:", error);
      throw error;
    }
  },

  /**
   * Lấy các product liên quan
   * @param {string} productId - ID của product hiện tại
   * @param {number} limit - Số lượng product liên quan (mặc định 3)
   * @returns {Promise} Promise object với danh sách product liên quan
   */
  getRelatedProducts: async (productId, limit = 3) => {
    try {
      const response = await apiClient.get(
        `/api/products/${productId}/related?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  },
};

export default productsApi;
