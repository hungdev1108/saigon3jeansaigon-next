import overviewApi from "../api/overviewApi";

/**
 * Service để xử lý dữ liệu overview
 */
class OverviewService {
  /**
   * Lấy và xử lý tất cả dữ liệu cho trang overview
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteOverviewData() {
    try {
      const response = await overviewApi.getOverviewData();

      if (!response.success) {
        throw new Error("Failed to fetch overview data");
      }

      const { data } = response;

      // Xử lý và format dữ liệu
      return {
        banner: this.processBannerData(data.banner),
        milestones: this.processMilestonesData(data.milestones),
        message: this.processMessageData(data.message),
        visionMission: this.processVisionMissionData(data.visionMission),
        coreValues: this.processCoreValuesData(data.coreValues),
      };
    } catch (error) {
      console.error(
        "OverviewService - Error getting complete overview data:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultOverviewData();
    }
  }

  /**
   * Xử lý dữ liệu banner
   * @param {Object} bannerData - Dữ liệu banner từ API
   * @returns {Object} Dữ liệu banner đã xử lý
   */
  processBannerData(bannerData) {
    if (!bannerData) return this.getDefaultBanner();

    return {
      id: bannerData._id || "",
      title: bannerData.title || "",
      description: bannerData.description || "",
      backgroundImage: bannerData.backgroundImage || "",
      isActive: bannerData.isActive !== false,
    };
  }

  /**
   * Xử lý dữ liệu milestones
   * @param {Array} milestonesData - Dữ liệu milestones từ API
   * @returns {Array} Dữ liệu milestones đã xử lý
   */
  processMilestonesData(milestonesData) {
    if (!Array.isArray(milestonesData)) return this.getDefaultMilestones();

    return milestonesData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((milestone) => ({
        id: milestone._id || "",
        year: milestone.year || "",
        title: milestone.title || "",
        description: milestone.description || "",
        image: milestone.image || "",
        order: milestone.order || 0,
      }));
  }

  /**
   * Xử lý dữ liệu CEO message
   * @param {Object} messageData - Dữ liệu message từ API
   * @returns {Object} Dữ liệu message đã xử lý
   */
  processMessageData(messageData) {
    if (!messageData) return this.getDefaultMessage();

    return {
      id: messageData._id || "",
      ceoName: messageData.ceoName || "",
      ceoImage: messageData.ceoImage || "",
      content: this.processMessageContent(messageData.content),
      isActive: messageData.isActive !== false,
    };
  }

  /**
   * Xử lý nội dung message
   * @param {Array} contentArray - Mảng content từ API
   * @returns {Array} Mảng content đã xử lý
   */
  processMessageContent(contentArray) {
    if (!Array.isArray(contentArray)) return [];

    return contentArray
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((content) => ({
        id: content._id || "",
        paragraph: content.paragraph || "",
        order: content.order || 0,
      }));
  }

  /**
   * Xử lý dữ liệu vision/mission
   * @param {Object} visionMissionData - Dữ liệu vision/mission từ API
   * @returns {Object} Dữ liệu vision/mission đã xử lý
   */
  processVisionMissionData(visionMissionData) {
    if (!visionMissionData) return this.getDefaultVisionMission();

    return {
      id: visionMissionData._id || "",
      vision: {
        icon: visionMissionData.vision?.icon || "fas fa-eye",
        title: visionMissionData.vision?.title || "VISION",
        content: visionMissionData.vision?.content || "",
      },
      mission: {
        icon: visionMissionData.mission?.icon || "fas fa-bullseye",
        title: visionMissionData.mission?.title || "MISSION",
        content: visionMissionData.mission?.content || "",
      },
      isActive: visionMissionData.isActive !== false,
    };
  }

  /**
   * Xử lý dữ liệu core values
   * @param {Array} coreValuesData - Dữ liệu core values từ API
   * @returns {Array} Dữ liệu core values đã xử lý
   */
  processCoreValuesData(coreValuesData) {
    if (!Array.isArray(coreValuesData)) return this.getDefaultCoreValues();

    return coreValuesData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((value) => ({
        id: value._id || "",
        title: value.title || "",
        content: value.content || "",
        icon: value.icon || "",
        order: value.order || 0,
      }));
  }

  /**
   * Lấy dữ liệu banner riêng biệt
   * @returns {Promise<Object>} Banner data
   */
  async getBanner() {
    try {
      const response = await overviewApi.getBanner();
      if (!response.success) {
        throw new Error("Failed to fetch banner");
      }
      return this.processBannerData(response.data);
    } catch (error) {
      console.error("OverviewService - Error getting banner:", error);
      return this.getDefaultBanner();
    }
  }

  /**
   * Lấy dữ liệu milestones riêng biệt
   * @returns {Promise<Array>} Milestones data
   */
  async getMilestones() {
    try {
      const response = await overviewApi.getMilestones();
      if (!response.success) {
        throw new Error("Failed to fetch milestones");
      }
      return this.processMilestonesData(response.data);
    } catch (error) {
      console.error("OverviewService - Error getting milestones:", error);
      return this.getDefaultMilestones();
    }
  }

  /**
   * Cập nhật banner
   * @param {Object} bannerData - Dữ liệu banner
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateBanner(bannerData) {
    try {
      const response = await overviewApi.updateBanner(bannerData);
      return response;
    } catch (error) {
      console.error("OverviewService - Error updating banner:", error);
      throw error;
    }
  }

  /**
   * Cập nhật milestones
   * @param {Array} milestonesData - Dữ liệu milestones
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateMilestones(milestonesData) {
    try {
      const response = await overviewApi.updateMilestones(milestonesData);
      return response;
    } catch (error) {
      console.error("OverviewService - Error updating milestones:", error);
      throw error;
    }
  }

  // Dữ liệu mặc định khi API fail
  getDefaultOverviewData() {
    return {
      banner: this.getDefaultBanner(),
      milestones: this.getDefaultMilestones(),
      message: this.getDefaultMessage(),
      visionMission: this.getDefaultVisionMission(),
      coreValues: this.getDefaultCoreValues(),
    };
  }

  getDefaultBanner() {
    return {
      id: "default-banner",
      title: "SAIGON 3 JEAN GROUP",
      description:
        "Saigon 3 Jean Group is a leading manufacturer in Vietnam's textile and garment industry. We specialize in producing high-quality denim products, including jeans, jackets, and other garment items for both domestic and international markets. With modern facilities and skilled workforce, we are committed to delivering excellence in every product we create. Our company values sustainability, innovation, and customer satisfaction as we continue to grow and expand our presence in the global textile industry.",
      backgroundImage: "/images/overview-page/overview_banner.png",
      isActive: true,
    };
  }

  getDefaultMilestones() {
    return [
      {
        id: "default-1",
        year: "2019",
        title: "Beginning",
        description:
          "Established the company with a vision to produce high-quality denim for both domestic and international markets",
        image: "/images/overview-page/overview_1.jpg",
        order: 1,
      },
      {
        id: "default-2",
        year: "2020",
        title: "Expansion",
        description:
          "Expanded production capacity and modernized technology to meet increasing demand",
        image: "/images/overview-page/overview_2.jpg",
        order: 2,
      },
      {
        id: "default-3",
        year: "2021",
        title: "Innovation",
        description:
          "Applied new technology and sustainable production processes, ensuring environmental friendliness",
        image: "/images/overview-page/overview_3.jpg",
        order: 3,
      },
      {
        id: "default-4",
        year: "2022",
        title: "Globalization",
        description:
          "Expanded export markets and established strategic partnerships globally",
        image: "/images/overview-page/overview_4.jpg",
        order: 4,
      },
      {
        id: "default-5",
        year: "2023",
        title: "60 Hectares",
        description:
          "Expanded factory area to 60 hectares with modern production capacity",
        image: "/images/overview-page/overview_5.jpg",
        order: 5,
      },
      {
        id: "default-6",
        year: "2024",
        title: "Expansion",
        description:
          "Expanded production capacity and modernized technology to meet increasing demand",
        image: "/images/overview-page/overview_6.jpg",
        order: 6,
      },
    ];
  }

  getDefaultMessage() {
    return {
      id: "default-message",
      ceoName: "CEO",
      ceoImage: "/images/overview-page/CEO.jpg",
      content: [
        {
          id: "default-content-1",
          paragraph:
            '"Saigon 3 will always be associated with the core value of "Quality creates the difference"..."',
          order: 1,
        },
        {
          id: "default-content-2",
          paragraph:
            '"Saigon 3 also positions itself as a pioneer in applying modern, sustainable, and eco-friendly technologies..."',
          order: 2,
        },
        {
          id: "default-content-3",
          paragraph:
            '"Our culture is demonstrated through the talent, ethics, and passion of our leaders..."',
          order: 3,
        },
      ],
      isActive: true,
    };
  }

  getDefaultVisionMission() {
    return {
      id: "default-vision-mission",
      vision: {
        icon: "fas fa-eye",
        title: "VISION",
        content:
          "To assert our position as a pioneer in sustainable garment production, driving innovation and environmental responsibility within the industry. Saigon 3 will continue to lead in denim garment supplier services and champion eco-friendly.",
      },
      mission: {
        icon: "fas fa-bullseye",
        title: "MISSION",
        content:
          "To provide the highest quality denim garments and denim washing services, ensuring excellence in every product. Saigon 3 aims to be a second home for all of our employees, fostering a supportive and thriving work environment.",
      },
      isActive: true,
    };
  }

  getDefaultCoreValues() {
    return [
      {
        id: "default-value-1",
        title: "Partnership & Trust",
        content: "Building long-term relationships through mutual trust and respect.",
        icon: "fas fa-handshake",
        order: 1,
      },
      {
        id: "default-value-2",
        title: "Innovation",
        content: "Constantly exploring new ideas and technologies.",
        icon: "fas fa-lightbulb",
        order: 2,
      },
      {
        id: "default-value-3",
        title: "Sustainability",
        content: "Commitment to sustainable and environmentally friendly production.",
        icon: "fas fa-leaf",
        order: 3,
      },
      {
        id: "default-value-4",
        title: "Community",
        content: "Supporting our employees and local communities.",
        icon: "fas fa-users",
        order: 4,
      },
      {
        id: "default-value-5",
        title: "Growth",
        content: "Pursuing excellence and growth for a better future.",
        icon: "fas fa-chart-line",
        order: 5,
      },
    ];
  }
}

// Export instance của service
const overviewService = new OverviewService();
export default overviewService;
