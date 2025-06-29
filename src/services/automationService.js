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

      // Xử lý và format dữ liệu
      return {
        pageTitle: data.pageTitle || "AUTOMATION",
        pageDescription: data.pageDescription || "Advanced automation systems for precision manufacturing",
        items: this.processItemsData(data.items),
        seo: this.processSeoData(data.seo),
      };
    } catch (error) {
      console.error(
        "AutomationService - Error getting complete automation data:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultAutomationData();
    }
  }

  /**
   * Xử lý dữ liệu automation items
   * @param {Array} itemsData - Dữ liệu items từ API
   * @returns {Array} Dữ liệu items đã xử lý
   */
  processItemsData(itemsData) {
    if (!Array.isArray(itemsData)) return this.getDefaultItems();

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
      return this.getDefaultItems();
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
      },
      {
        id: "default-2",
        title: "Smart Manufacturing",
        description: "Intelligent manufacturing processes with IoT integration and data analytics for optimal efficiency and reduced waste.",
        image: "/uploads/images/automation/automation_2.jpg",
        imageAlt: "Smart Manufacturing System",
        order: 2,
        isActive: true,
      },
      {
        id: "default-3",
        title: "Process Automation",
        description: "Streamlined production workflows with automated material handling and processing for increased productivity.",
        image: "/uploads/images/automation/automation_3.png",
        imageAlt: "Process Automation System",
        order: 3,
        isActive: true,
      },
      {
        id: "default-4",
        title: "Digital Integration",
        description: "Seamless integration of digital technologies for enhanced communication and coordination across all production stages.",
        image: "/uploads/images/automation/automation_4.png",
        imageAlt: "Digital Integration System",
        order: 4,
        isActive: true,
      },
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