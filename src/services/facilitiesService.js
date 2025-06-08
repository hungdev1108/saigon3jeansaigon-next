import facilitiesApi from "../api/facilitiesApi";
import {BACKEND_DOMAIN} from '../api/config';


/**
 * Service để xử lý dữ liệu facilities
 */
class FacilitiesService {
  /**
   * Fix đường dẫn hình ảnh từ API
   * @param {string} imagePath - Đường dẫn hình ảnh từ API
   * @returns {string} Đường dẫn đã được sửa
   */
  fixImagePath(imagePath) {
    if (!imagePath) return "";

    // Nếu đã có http thì giữ nguyên
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Nếu đã có /uploads/ thì thêm base URL
    if (imagePath.startsWith("/uploads/")) {
      return `${BACKEND_DOMAIN}${imagePath}`;
    }

    // Fallback cho đường dẫn cũ - tất cả đều chuyển về backend
    return `${BACKEND_DOMAIN}${imagePath}`;
  }

  /**
   * Lấy và xử lý tất cả dữ liệu cho trang facilities
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteFacilitiesData() {
    try {
      const response = await facilitiesApi.getFacilitiesData();

      if (!response.success) {
        throw new Error("Failed to fetch facilities data");
      }

      const { data } = response;

      // Xử lý và format dữ liệu
      return {
        pageTitle: data.pageTitle || "FACILITIES",
        pageDescription:
          data.pageDescription ||
          "Discover our state-of-the-art manufacturing facilities and capabilities",
        keyMetrics: this.processKeyMetricsData(data.keyMetrics),
        facilityFeatures: this.processFacilityFeaturesData(
          data.facilityFeatures
        ),
        seo: this.processSeoData(data.seo),
      };
    } catch (error) {
      console.error(
        "FacilitiesService - Error getting complete facilities data:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultFacilitiesData();
    }
  }

  /**
   * Xử lý dữ liệu key metrics
   * @param {Array} keyMetricsData - Dữ liệu key metrics từ API
   * @returns {Array} Dữ liệu key metrics đã xử lý
   */
  processKeyMetricsData(keyMetricsData) {
    if (!Array.isArray(keyMetricsData)) return this.getDefaultKeyMetrics();

    return keyMetricsData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((metric) => ({
        id: metric._id || "",
        icon: metric.icon || "fas fa-chart-bar",
        value: metric.value || "0",
        unit: metric.unit || "",
        label: metric.label || "",
        order: metric.order || 0,
      }));
  }

  /**
   * Xử lý dữ liệu facility features
   * @param {Array} facilityFeaturesData - Dữ liệu facility features từ API
   * @returns {Array} Dữ liệu facility features đã xử lý
   */
  processFacilityFeaturesData(facilityFeaturesData) {
    if (!Array.isArray(facilityFeaturesData))
      return this.getDefaultFacilityFeatures();

    return facilityFeaturesData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((feature) => ({
        id: feature._id || "",
        title: feature.title || "",
        description: feature.description || "",
        image:
          this.fixImagePath(feature.image) ||
          "/images/placeholder-facility.jpg",
        imageAlt: feature.imageAlt || `${feature.title} Facilities`,
        order: feature.order || 0,
        layout: feature.layout || "left",
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
      metaTitle: seoData.metaTitle || "Facilities - Saigon 3 Jean",
      metaDescription:
        seoData.metaDescription ||
        "Explore Saigon 3 Jean modern facilities, advanced technology, and talented workforce driving sustainable denim manufacturing excellence.",
      keywords: Array.isArray(seoData.keywords)
        ? seoData.keywords
        : ["facilities", "manufacturing", "denim", "sustainable", "technology"],
    };
  }

  /**
   * Lấy dữ liệu key metrics riêng biệt
   * @returns {Promise<Array>} Danh sách key metrics
   */
  async getKeyMetrics() {
    try {
      const response = await facilitiesApi.getKeyMetrics();
      if (!response.success) {
        throw new Error("Failed to fetch key metrics");
      }
      return this.processKeyMetricsData(response.data);
    } catch (error) {
      console.error("FacilitiesService - Error getting key metrics:", error);
      return this.getDefaultKeyMetrics();
    }
  }

  /**
   * Lấy dữ liệu facility features riêng biệt
   * @returns {Promise<Array>} Danh sách facility features
   */
  async getFacilityFeatures() {
    try {
      const response = await facilitiesApi.getFacilityFeatures();
      if (!response.success) {
        throw new Error("Failed to fetch facility features");
      }
      return this.processFacilityFeaturesData(response.data);
    } catch (error) {
      console.error(
        "FacilitiesService - Error getting facility features:",
        error
      );
      return this.getDefaultFacilityFeatures();
    }
  }

  /**
   * Cập nhật key metrics
   * @param {Array} metrics - Danh sách key metrics
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateKeyMetrics(metrics) {
    try {
      const response = await facilitiesApi.updateKeyMetrics(metrics);
      return response;
    } catch (error) {
      console.error("FacilitiesService - Error updating key metrics:", error);
      throw error;
    }
  }

  /**
   * Cập nhật facility features
   * @param {Array} features - Danh sách facility features
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateFacilityFeatures(features) {
    try {
      const response = await facilitiesApi.updateFacilityFeatures(features);
      return response;
    } catch (error) {
      console.error(
        "FacilitiesService - Error updating facility features:",
        error
      );
      throw error;
    }
  }

  // Dữ liệu mặc định khi API fail
  getDefaultFacilitiesData() {
    return {
      pageTitle: "FACILITIES",
      pageDescription:
        "Discover our state-of-the-art manufacturing facilities and capabilities",
      keyMetrics: this.getDefaultKeyMetrics(),
      facilityFeatures: this.getDefaultFacilityFeatures(),
      seo: this.getDefaultSeoData(),
    };
  }

  getDefaultKeyMetrics() {
    return [
      {
        id: "default-1",
        icon: "fas fa-expand-arrows-alt",
        value: "50.000",
        unit: "m²",
        label: "Area",
        order: 1,
      },
      {
        id: "default-2",
        icon: "fas fa-users",
        value: "240",
        unit: "",
        label: "Employees",
        order: 2,
      },
      {
        id: "default-3",
        icon: "fas fa-boxes",
        value: "1.200.000",
        unit: "",
        label: "pcs/year",
        order: 3,
      },
    ];
  }

  getDefaultFacilityFeatures() {
    return [
      {
        id: "default-1",
        title: "OUT DOOR",
        description:
          "We are committed to creating a green, clean, and friendly working environment, contributing to the development of a sustainable ecosystem around the business.",
        image: "/images/facilities-page/section_1-outdoor.jpg",
        imageAlt: "Outdoor Facilities",
        order: 1,
        layout: "left",
      },
      {
        id: "default-2",
        title: "OFFICE",
        description:
          "The workspace is optimized to create a clean, safe, and comfortable environment, enhancing health, boosting productivity, and providing comfort for employees.",
        image: "/images/facilities-page/section_2-office.jpg",
        imageAlt: "Office Facilities",
        order: 2,
        layout: "right",
      },
      {
        id: "default-3",
        title: "FACILITIES",
        description:
          "The modern infrastructure system is comprehensively invested, from advanced production lines and automation technology to strict quality control processes.",
        image: "/images/facilities-page/section_3-facilities.jpg",
        imageAlt: "Manufacturing Facilities",
        order: 3,
        layout: "left",
      },
      {
        id: "default-4",
        title: "TALENTED WORKFORCE",
        description:
          "People are the core factor that drives the success and sustainable development of the business. Therefore, investing in training and skill development is always a priority to enhance capabilities and create sustainable value.",
        image: "/images/facilities-page/section_4-talented.jpg",
        imageAlt: "Talented Workforce",
        order: 4,
        layout: "right",
      },
    ];
  }

  getDefaultSeoData() {
    return {
      metaTitle: "Facilities - Saigon 3 Jean",
      metaDescription:
        "Explore Saigon 3 Jean modern facilities, advanced technology, and talented workforce driving sustainable denim manufacturing excellence.",
      keywords: [
        "facilities",
        "manufacturing",
        "denim",
        "sustainable",
        "technology",
      ],
    };
  }
}

// Export instance của service
const facilitiesService = new FacilitiesService();
export default facilitiesService;
