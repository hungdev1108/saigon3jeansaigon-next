import automationApi from "../api/automationApi";

/**
 * Service để xử lý dữ liệu automation
 */
class AutomationService {
  /**
   * Lấy và xử lý tất cả dữ liệu cho trang automation
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteAutomationData() {
    try {
      const response = await automationApi.getAutomationData();
      if (!response.success) {
        throw new Error("Failed to fetch automation data");
      }
      const { data } = response;
      // Ưu tiên lấy automationItems, fallback sang items nếu không có
      const itemsArr = Array.isArray(data.automationItems) ? data.automationItems : data.items;
      return {
        pageTitle: data.pageTitle || "AUTOMATION",
        pageDescription: data.pageDescription || "Advanced automation systems for precision manufacturing",
        items: this.processItemsData(itemsArr),
        seo: this.processSeoData(data.seo),
      };
    } catch (error) {
      console.error(
        "AutomationService - Error getting complete automation data:",
        error
      );
      // Không trả về dữ liệu mặc định nữa
      return { items: [] };
    }
  }

  /**
   * Xử lý dữ liệu automation items
   * @param {Array} itemsData - Dữ liệu items từ API
   * @returns {Array} Dữ liệu items đã xử lý
   */
  processItemsData(itemsData) {
    if (!Array.isArray(itemsData)) return [];

    return itemsData
      .filter((item) => item.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((item) => ({
        id: item._id || "",
        title: item.title || "",
        description: item.description || "",
        image: item.image || "",
        imageAlt: item.imageAlt || item.title,
        order: item.order || 0,
        isActive: item.isActive !== false,
        contentItems: Array.isArray(item.contentItems) ? item.contentItems.map(content => ({
          _id: content._id || `content-${content.title}`,
          title: content.title || "",
          description: content.description || "",
          order: content.order || 0,
          isActive: content.isActive !== false
        })) : []
      }));
  }

  /**
   * Xử lý dữ liệu SEO
   * @param {Object} seoData - Dữ liệu SEO từ API
   * @returns {Object} Dữ liệu SEO đã xử lý
   */
  processSeoData(seoData) {
    if (!seoData) return this.getDefaultSeoData();

    return {
      metaTitle: seoData.metaTitle || "Automation - Saigon 3 Jean",
      metaDescription:
        seoData.metaDescription ||
        "Discover Saigon 3 Jean advanced automation systems for precision manufacturing and quality control.",
      keywords: Array.isArray(seoData.keywords)
        ? seoData.keywords
        : [
            "automation",
            "manufacturing",
            "precision",
            "quality control",
            "industrial automation",
          ],
    };
  }

  /**
   * Lấy dữ liệu items riêng biệt
   * @returns {Promise<Array>} Danh sách items
   */
  async getItems() {
    try {
      const response = await automationApi.getItems();
      if (!response.success) {
        throw new Error("Failed to fetch automation items");
      }
      return this.processItemsData(response.data);
    } catch (error) {
      console.error("AutomationService - Error getting items:", error);
      return [];
    }
  }

  /**
   * Cập nhật danh sách automation items
   * @param {Array} items - Danh sách automation items
   * @param {Object} files - Các file ảnh cần upload
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateItems(items, files = {}) {
    try {
      // Xử lý upload files nếu có
      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        
        // Thêm các file vào formData
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
        
        // Thêm dữ liệu items dưới dạng JSON
        formData.append('items', JSON.stringify(items));
        
        // Gọi API với formData
        const response = await fetch(`${automationApi.baseUrl}/api/automation/items/with-files`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update items: ${response.statusText}`);
        }
        
        return await response.json();
      } else {
        // Nếu không có file, gọi API thông thường
        return await automationApi.updateItems(items);
      }
    } catch (error) {
      console.error("AutomationService - Error updating items:", error);
      throw error;
    }
  }

  /**
   * Cập nhật cài đặt trang automation
   * @param {Object} settings - Cài đặt trang (title, description, SEO)
   * @param {Object} files - Các file cần upload
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updatePageSettings(settings, files = {}) {
    try {
      // Xử lý upload files nếu có
      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        
        // Thêm các file vào formData
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
        
        // Thêm dữ liệu settings dưới dạng JSON
        formData.append('settings', JSON.stringify(settings));
        
        // Gọi API với formData
        const response = await fetch(`${automationApi.baseUrl}/api/automation/settings/with-files`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update settings: ${response.statusText}`);
        }
        
        return await response.json();
      } else {
        // Nếu không có file, gọi API thông thường
        return await automationApi.updatePageSettings(settings);
      }
    } catch (error) {
      console.error("AutomationService - Error updating page settings:", error);
      throw error;
    }
  }

  /**
   * Cập nhật một automation item
   * @param {string} itemId - ID của item cần cập nhật
   * @param {Object} itemData - Dữ liệu cập nhật
   * @param {File|null} file - File ảnh mới (nếu có)
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateItem(itemId, itemData, file) {
    try {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        // Thêm các trường dữ liệu khác
        Object.entries(itemData).forEach(([key, value]) => {
          if (key !== 'image' && key !== 'contentItems') {
            formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
          }
        });
        
        // Xử lý contentItems riêng vì là array
        if (itemData.contentItems) {
          formData.append('contentItems', JSON.stringify(itemData.contentItems));
        }
        
        // Gọi API với formData
        const response = await fetch(`${automationApi.baseUrl}/api/automation/items/${itemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update item: ${response.statusText}`);
        }
        
        return await response.json();
      } else {
        // Nếu không có file, gửi dữ liệu dưới dạng JSON
        const response = await fetch(`${automationApi.baseUrl}/api/automation/items/${itemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemData)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update item: ${response.statusText}`);
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error(`AutomationService - Error updating item ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Thêm mới một automation item
   * @param {Object} itemData - Dữ liệu item mới
   * @param {File|null} file - File ảnh (nếu có)
   * @returns {Promise<Object>} Kết quả thêm mới
   */
  async addItem(itemData, file) {
    try {
      console.log('addItem - itemData:', itemData);
      console.log('addItem - file:', file);
      
      // Kiểm tra dữ liệu cần thiết
      if (!itemData.title || !file) {
        throw new Error('Tiêu đề và ảnh là bắt buộc');
      }
      
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        // Thêm các trường dữ liệu đơn lẻ
        formData.append('title', itemData.title);
        formData.append('description', itemData.description || itemData.title);
        
        // Đảm bảo contentItems luôn là array và được stringify đúng cách
        if (Array.isArray(itemData.contentItems) && itemData.contentItems.length > 0) {
          formData.append('contentItems', JSON.stringify(itemData.contentItems));
          console.log('contentItems as JSON:', JSON.stringify(itemData.contentItems));
        } else {
          // Tạo contentItem mặc định từ title và description
          const defaultContentItem = [{ 
            title: itemData.title, 
            description: itemData.description || itemData.title 
          }];
          formData.append('contentItems', JSON.stringify(defaultContentItem));
          console.log('default contentItems:', JSON.stringify(defaultContentItem));
        }
        
        // Gọi API với formData
        const response = await fetch(`${automationApi.baseUrl}/api/automation/items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Server error response:', errorData);
          throw new Error(`Failed to add item: ${response.statusText}`);
        }
        
        return await response.json();
      } else {
        throw new Error('Ảnh đại diện là bắt buộc');
      }
    } catch (error) {
      console.error("AutomationService - Error adding item:", error);
      throw error;
    }
  }

  /**
   * Xóa một automation item
   * @param {string} itemId - ID của item cần xóa
   * @returns {Promise<Object>} Kết quả xóa
   */
  async deleteItem(itemId) {
    try {
      const response = await fetch(`${automationApi.baseUrl}/api/automation/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`AutomationService - Error deleting item ${itemId}:`, error);
      throw error;
    }
  }

  // Legacy support - giữ method cũ để không break existing code
  async Load() {
    try {
      const response = await automationApi.Load();
      return response;
    } catch (error) {
      console.error(
        "AutomationService - Error loading automation data:",
        error
      );
      // Trả về dữ liệu mặc định khi có lỗi
      return {
        success: true,
        data: this.getDefaultItems(),
      };
    }
  }

  // Dữ liệu mặc định khi API fail
  getDefaultAutomationData() {
    return {
      pageTitle: "AUTOMATION",
      pageDescription: "Advanced automation systems for precision manufacturing",
      items: this.getDefaultItems(),
      seo: this.getDefaultSeoData(),
    };
  }

  getDefaultItems() {
    return [
      {
        id: "default-1",
        title: "Automated Quality Control",
        description: "Advanced automation systems ensure consistent quality and precision in every product through real-time monitoring and control.",
        image: "/uploads/images/automation/automation_1.png",
        imageAlt: "Automated Quality Control System",
        order: 1,
        isActive: true,
        contentItems: [
          {
            _id: "content-automated-1",
            title: "AUTOMATED QUALITY CONTROL",
            description: "Advanced automation systems ensure consistent quality and precision in every product through real-time monitoring and control.",
            order: 1,
            isActive: true
          },
          {
            _id: "content-automated-2",
            title: "REAL-TIME MONITORING",
            description: "Continuous monitoring of production metrics with instant feedback to maintain optimal performance and quality standards.",
            order: 2,
            isActive: true
          },
          {
            _id: "content-automated-3",
            title: "PRECISION TESTING",
            description: "Automated testing procedures that ensure each product meets exact specifications before proceeding to the next stage.",
            order: 3,
            isActive: true
          }
        ]
      },
      {
        id: "default-2",
        title: "Smart Manufacturing",
        description: "Intelligent manufacturing processes with IoT integration and data analytics for optimal efficiency and reduced waste.",
        image: "/uploads/images/automation/automation_2.jpg",
        imageAlt: "Smart Manufacturing System",
        order: 2,
        isActive: true,
        contentItems: [
          {
            _id: "content-smart-1",
            title: "SMART MANUFACTURING",
            description: "Intelligent manufacturing processes with IoT integration and data analytics for optimal efficiency and reduced waste.",
            order: 1,
            isActive: true
          },
          {
            _id: "content-smart-2",
            title: "IoT CONNECTIVITY",
            description: "Connected devices throughout our factory floor communicate seamlessly to optimize production flow.",
            order: 2,
            isActive: true
          },
          {
            _id: "content-smart-3",
            title: "DATA ANALYTICS",
            description: "Advanced analytics provide insights for continuous improvement and proactive maintenance scheduling.",
            order: 3,
            isActive: true
          }
        ]
      },
      {
        id: "default-3",
        title: "Process Automation",
        description: "Streamlined production workflows with automated material handling and processing for increased productivity.",
        image: "/uploads/images/automation/automation_3.png",
        imageAlt: "Process Automation System",
        order: 3,
        isActive: true,
        contentItems: [
          {
            _id: "content-process-1",
            title: "PROCESS AUTOMATION",
            description: "Streamlined production workflows with automated material handling and processing for increased productivity.",
            order: 1,
            isActive: true
          },
          {
            _id: "content-process-2",
            title: "MATERIAL HANDLING",
            description: "Robotic systems that efficiently move materials between production stages with precision and reliability.",
            order: 2,
            isActive: true
          },
          {
            _id: "content-process-3",
            title: "WORKFLOW OPTIMIZATION",
            description: "Automated workflows that reduce downtime and maximize throughput across production lines.",
            order: 3,
            isActive: true
          }
        ]
      },
      {
        id: "default-4",
        title: "Digital Integration",
        description: "Seamless integration of digital technologies for enhanced communication and coordination across all production stages.",
        image: "/uploads/images/automation/automation_4.png",
        imageAlt: "Digital Integration System",
        order: 4,
        isActive: true,
        contentItems: [
          {
            _id: "content-digital-1",
            title: "DIGITAL INTEGRATION",
            description: "Seamless integration of digital technologies for enhanced communication and coordination across all production stages.",
            order: 1,
            isActive: true
          },
          {
            _id: "content-digital-2",
            title: "CENTRALIZED CONTROL",
            description: "Single control interface for monitoring and managing all aspects of production from one dashboard.",
            order: 2,
            isActive: true
          },
          {
            _id: "content-digital-3",
            title: "CLOUD CONNECTIVITY",
            description: "Secure cloud-based systems for real-time data access and sharing across facilities worldwide.",
            order: 3,
            isActive: true
          }
        ]
      }
    ];
  }

  getDefaultSeoData() {
    return {
      metaTitle: "Automation - Saigon 3 Jean",
      metaDescription:
        "Discover Saigon 3 Jean advanced automation systems for precision manufacturing and quality control.",
      keywords: [
        "automation",
        "manufacturing",
        "precision",
        "quality control",
        "industrial automation",
      ],
    };
  }
}

// Export instance của service
const automationService = new AutomationService();
export default automationService;