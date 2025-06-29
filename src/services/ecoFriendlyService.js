import ecoFriendlyApi from "../api/ecoFriendlyApi";

/**
 * Service để xử lý dữ liệu eco friendly
 */
class EcoFriendlyService {
  /**
   * Lấy và xử lý tất cả dữ liệu cho trang eco-friendly
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteEcoFriendlyData() {
    try {
      const response = await ecoFriendlyApi.getEcoFriendlyData();

      if (!response.success) {
        throw new Error("Failed to fetch eco-friendly data");
      }

      const { data } = response;

      // Xử lý và format dữ liệu
      return {
        pageTitle: data.pageTitle || "Eco-Friendly - Saigon 3 Jean",
        pageDescription: data.pageDescription || "Our sustainable production practices and eco-friendly technologies",
        hero: this.processHeroData(data.hero),
        mainImage: data.mainImage || "/images/eco-friendly/home_banner-section2.jpg",
        mainImageAlt: data.mainImageAlt || "Eco-friendly operations",
        features: this.processFeaturesData(data.features),
        sections: this.processSectionsData(data.sections),
        seo: this.processSeoData(data.seo),
      };
    } catch (error) {
      console.error(
        "EcoFriendlyService - Error getting complete eco-friendly data:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultEcoFriendlyData();
    }
  }

  /**
   * Xử lý dữ liệu hero
   * @param {Object} heroData - Dữ liệu hero từ API
   * @returns {Object} Dữ liệu hero đã xử lý
   */
  processHeroData(heroData) {
    if (!heroData) return this.getDefaultHeroData();

    return {
      image: heroData.image || "/images/eco-friendly/home_banner-section3.png",
      imageAlt: heroData.imageAlt || "Eco-friendly facilities",
    };
  }

  /**
   * Xử lý dữ liệu features
   * @param {Array} featuresData - Dữ liệu features từ API
   * @returns {Array} Dữ liệu features đã xử lý
   */
  processFeaturesData(featuresData) {
    if (!Array.isArray(featuresData)) return this.getDefaultFeatures();

    return featuresData
      .filter((feature) => feature.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((feature) => ({
        id: feature._id || "",
        title: feature.title || "",
        points: Array.isArray(feature.points) ? feature.points : [],
        order: feature.order || 0,
        isActive: feature.isActive !== false,
      }));
  }

  /**
   * Xử lý dữ liệu sections
   * @param {Array} sectionsData - Dữ liệu sections từ API
   * @returns {Array} Dữ liệu sections đã xử lý
   */
  processSectionsData(sectionsData) {
    if (!Array.isArray(sectionsData)) return this.getDefaultSections();

    return sectionsData
      .filter((section) => section.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((section) => ({
        id: section._id || "",
        title: section.title || "",
        description: section.description || "",
        image: section.image || "",
        imageAlt: section.imageAlt || section.title,
        order: section.order || 0,
        stats: this.processStatsData(section.stats),
        isActive: section.isActive !== false,
      }));
  }

  /**
   * Xử lý dữ liệu stats
   * @param {Array} statsData - Dữ liệu stats từ API
   * @returns {Array} Dữ liệu stats đã xử lý
   */
  processStatsData(statsData) {
    if (!Array.isArray(statsData)) return [];

    return statsData.map((stat) => ({
      id: stat._id || "",
      value: stat.value || "",
      label: stat.label || "",
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
      metaTitle: seoData.metaTitle || "Eco-Friendly - Saigon 3 Jean",
      metaDescription:
        seoData.metaDescription ||
        "Discover Saigon 3 Jean sustainable and eco-friendly production practices, including solar energy, water recycling, and green technologies.",
      keywords: Array.isArray(seoData.keywords)
        ? seoData.keywords
        : [
            "eco-friendly",
            "sustainable",
            "solar energy",
            "water recycling",
            "green manufacturing",
          ],
    };
  }

  /**
   * Lấy dữ liệu features riêng biệt
   * @returns {Promise<Array>} Danh sách features
   */
  async getFeatures() {
    try {
      const response = await ecoFriendlyApi.getFeatures();
      if (!response.success) {
        throw new Error("Failed to fetch features");
      }
      return this.processFeaturesData(response.data);
    } catch (error) {
      console.error("EcoFriendlyService - Error getting features:", error);
      return this.getDefaultFeatures();
    }
  }

  /**
   * Lấy dữ liệu sections riêng biệt
   * @returns {Promise<Array>} Danh sách sections
   */
  async getSections() {
    try {
      const response = await ecoFriendlyApi.getSections();
      if (!response.success) {
        throw new Error("Failed to fetch sections");
      }
      return this.processSectionsData(response.data);
    } catch (error) {
      console.error("EcoFriendlyService - Error getting sections:", error);
      return this.getDefaultSections();
    }
  }

  // Dữ liệu mặc định khi API fail
  getDefaultEcoFriendlyData() {
    return {
      pageTitle: "Eco-Friendly - Saigon 3 Jean",
      pageDescription: "Our sustainable production practices and eco-friendly technologies",
      hero: this.getDefaultHeroData(),
      mainImage: "/images/eco-friendly/home_banner-section2.jpg",
      mainImageAlt: "Eco-friendly operations",
      features: this.getDefaultFeatures(),
      sections: this.getDefaultSections(),
      seo: this.getDefaultSeoData(),
    };
  }

  getDefaultHeroData() {
    return {
      image: "/images/eco-friendly/home_banner-section3.png",
      imageAlt: "Eco-friendly facilities",
    };
  }

  getDefaultFeatures() {
    return [
      {
        id: "default-1",
        title: "SOLAR ENERGY",
        points: [
          "Use solar panel systems to provide clean energy for production activities.",
          "Reduce dependence on fossil fuel energy sources, contributing to the reduction of CO2 emissions.",
        ],
        order: 1,
        isActive: true,
      },
      {
        id: "default-2", 
        title: "AUTOMATED DATA FEEDING AND MONITORING SYSTEM",
        points: [
          "Use Eliar Automation technology to automate the feeding process, chemical adjustment, and dyeing process management.",
          "Monitor production and environmental parameters in real-time to ensure maximum efficiency.",
        ],
        order: 2,
        isActive: true,
      },
      {
        id: "default-3",
        title: "GREEN AREA",
        points: [
          "Develop green spaces around the factory to create a green environment and improve air quality.",
          "Enhance sustainability and the company's eco-friendly image.",
        ],
        order: 3,
        isActive: true,
      },
      {
        id: "default-4",
        title: "ENVIRONMENTALLY FRIENDLY",
        points: [
          "Áp dụng các công nghệ tiên tiến trong quản lý chất thải, nước thải và khí thải.",
          "Đảm bảo các quy trình sản xuất tuân thủ nghiêm ngặt các tiêu chuẩn quốc tế về bảo vệ môi trường.",
        ],
        order: 4,
        isActive: true,
      },
      {
        id: "default-5",
        title: "WATER RECYCLING",
        points: [
          "Implement advanced water treatment and recycling systems.",
          "Achieve up to 70% water recycling rate in production processes.",
        ],
        order: 5,
        isActive: true,
      },
    ];
  }

  getDefaultSections() {
    return [
      {
        id: "default-1",
        title: "SOLAR CELL SYSTEM",
        description: "Pioneering the application of solar energy in production, adhering to strict standards to optimize performance and reduce pressure on traditional power sources.",
        image: "/images/eco-friendly/anh 5 1.png",
        imageAlt: "Solar Cell System",
        order: 1,
        stats: [
          {
            id: "stat-1",
            value: "70%",
            label: "WATER RECYCLING",
          },
          {
            id: "stat-2", 
            value: "2,500",
            label: "m³/day CAPACITY",
          },
        ],
        isActive: true,
      },
      {
        id: "default-2",
        title: "LEADING THE AI REVOLUTION",
        description: "Applying AI and automation in the production process to optimize performance, enhance quality, and minimize waste. The auto-dosing system and smart dyeing washing control chemicals precisely, saving water and energy, aiming for sustainable production.",
        image: "/images/eco-friendly/anh 6 1.png",
        imageAlt: "AI Revolution",
        order: 2,
        stats: [],
        isActive: true,
      },
      {
        id: "default-3",
        title: "Biomass Boiler",
        description: "By using renewable fuel from organic materials, this system reduces carbon emissions and conserves energy. It's an eco-friendly solution that promotes green and sustainable manufacturing",
        image: "/images/eco-friendly/z6630648807114_da113af033725688c7e146b20f93957f 1.png",
        imageAlt: "Biomass Boiler",
        order: 3,
        stats: [],
        isActive: true,
      },
    ];
  }

  getDefaultSeoData() {
    return {
      metaTitle: "Eco-Friendly - Saigon 3 Jean",
      metaDescription:
        "Discover Saigon 3 Jean sustainable and eco-friendly production practices, including solar energy, water recycling, and green technologies.",
      keywords: [
        "eco-friendly",
        "sustainable", 
        "solar energy",
        "water recycling",
        "green manufacturing",
      ],
    };
  }
}

// Export instance của service
const ecoFriendlyService = new EcoFriendlyService();
export default ecoFriendlyService;
