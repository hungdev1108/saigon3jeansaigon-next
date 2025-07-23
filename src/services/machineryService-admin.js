import { BACKEND_DOMAIN } from '@/api/config';

class MachineryAdminService {
  /**
   * Lấy header có authorization token
   */
  getAuthHeaders() {
    // Tạm thời bỏ qua token để phát triển
    return {
      "Content-Type": "application/json",
    };
  }
  
  /**
   * Lấy header cho việc upload file
   */
  getUploadHeaders() {
    // Tạm thời bỏ qua token để phát triển
    return {};
  }
  
  /**
   * Lấy toàn bộ dữ liệu trang machinery cho admin
   */
  async getCompleteMachineryData() {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch data");
      return data;
    } catch (error) {
      console.error("Error fetching complete machinery data:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật thông tin chung của trang
   */
  async updatePageInfo(pageInfo) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/admin/page-settings`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(pageInfo),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      return data;
    } catch (error) {
      console.error("Error updating page info:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Thêm một stage mới
   */
  async addStage(stageData) {
    return this.addCategory(stageData);
  }

  /**
   * Cập nhật một stage
   */
  async updateStage(stageId, stageData) {
    return this.updateCategory(stageId, stageData);
  }

  /**
   * Xóa một stage
   */
  async deleteStage(stageId) {
    return this.deleteCategory(stageId);
  }

  /**
   * Thêm một danh mục (stage) mới
   */
  async addCategory(categoryData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add category");
      return data;
    } catch (error) {
      console.error("Error adding category:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật một danh mục (stage)
   */
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${categoryId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update category");
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa một danh mục (stage)
   */
  async deleteCategory(categoryId) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${categoryId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete category");
      return data;
    } catch (error) {
      console.error("Error deleting category:", error);
      return { success: false, message: error.message };
    }
  }
  
  /**
   * Thêm một máy mới vào danh mục
   */
  async addMachine(stageId, machineData, files) {
    try {
      const formData = new FormData();
      formData.append('name', machineData.name);
      formData.append('description', machineData.description);
      formData.append('order', machineData.order);
      formData.append('isActive', machineData.isActive);
      if (Array.isArray(files)) {
        files.forEach(file => formData.append('images', file));
      }
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${stageId}/machines`, {
        method: "POST",
        headers: this.getUploadHeaders(),
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add machine");
      return data;
    } catch (error) {
      console.error("Error adding machine:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật thông tin máy
   */
  async updateMachine(stageId, machineId, machineData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${stageId}/machines/${machineId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(machineData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update machine");
      return data;
    } catch (error) {
      console.error("Error updating machine:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa một máy
   */
  async deleteMachine(stageId, machineId) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${stageId}/machines/${machineId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete machine");
      return data;
    } catch (error) {
      console.error("Error deleting machine:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload hình ảnh cho máy
   */
  async uploadMachineImage(stageId, machineId, file) {
    try {
      const formData = new FormData();
      formData.append("images", file); // Backend expects 'images' field

      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${stageId}/machines/${machineId}/images`, {
        method: "POST",
        headers: this.getUploadHeaders(),
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to upload image");
      return data;
    } catch (error) {
      console.error("Error uploading machine image:", error);
      return { success: false, message: error.message };
    }
  }
  
    /**
   * Xóa hình ảnh của máy
   */
  async deleteMachineImage(stageId, machineId, imageId) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${stageId}/machines/${machineId}/images/${imageId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete image");
      return data;
    } catch (error) {
      console.error("Error deleting machine image:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload nhiều ảnh cho máy (multi-upload)
   */
  async uploadMultipleImages(stageId, machineId, files) {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${stageId}/machines/${machineId}/images`, {
        method: "POST",
        headers: this.getUploadHeaders(),
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to upload images");
      return data;
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cập nhật thông tin SEO
   */
  async updateSeoData(seoData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/admin/seo`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(seoData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      return data;
    } catch (error) {
      console.error("Error updating SEO data:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Xóa hình ảnh của máy theo _id
   */
  async deleteMachineImageById(stageId, machineId, imageId) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/machinery/stages/${stageId}/machines/${machineId}/images/by-id/${imageId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete image");
      return data;
    } catch (error) {
      console.error("Error deleting machine image by id:", error);
      return { success: false, message: error.message };
    }
  }
}

const machineryAdminService = new MachineryAdminService();
export default machineryAdminService; 