import machineryApi from "../api/machineryApi";

/**
 * Service để xử lý dữ liệu machinery
 */
class MachineryService {

  /**
   * Lấy và xử lý tất cả dữ liệu cho trang machinery
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteMachineryData() {
    try {
      const response = await machineryApi.getMachineryData();

      if (!response.success) {
        throw new Error("Failed to fetch machinery data");
      }

      const { data } = response;

      // Xử lý và format dữ liệu
      return {
        pageTitle:
          data.pageTitle ||
          "APPLICATION OF PRECISE PROGRAMMING, ENSURING CONSISTENCY IN PRODUCTION",
        pageDescription:
          data.pageDescription ||
          "Advanced machinery and precise programming systems for consistent, high-quality denim production",
        stages: this.processStagesData(data.stages),
        seo: this.processSeoData(data.seo),
      };
    } catch (error) {
      console.error(
        "MachineryService - Error getting complete machinery data:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultMachineryData();
    }
  }

  /**
   * Xử lý dữ liệu stages
   * @param {Array} stagesData - Dữ liệu stages từ API
   * @returns {Array} Dữ liệu stages đã xử lý
   */
  processStagesData(stagesData) {
    if (!Array.isArray(stagesData)) return this.getDefaultStages();

    return stagesData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((stage) => ({
        id: stage._id || "",
        stageNumber: stage.stageNumber || 1,
        title: stage.title || "",
        description: stage.description || "",
        machines: this.processMachinesData(stage.machines),
        order: stage.order || 0,
        isActive: stage.isActive !== false,
      }));
  }

  /**
   * Xử lý dữ liệu machines
   * @param {Array} machinesData - Dữ liệu machines từ API
   * @returns {Array} Dữ liệu machines đã xử lý
   */
  processMachinesData(machinesData) {
    if (!Array.isArray(machinesData)) return [];

    return machinesData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((machine) => ({
        id: machine._id || "",
        name: machine.name || "",
        description: machine.description || "",
        image: machine.image || "/images/placeholder-machine.jpg",
        images: this.processImagesArray(machine.images),
        imageAlt: machine.imageAlt || `${machine.name}`,
        order: machine.order || 0,
        isActive: machine.isActive !== false,
      }));
  }

  /**
   * Xử lý mảng images từ API
   * @param {Array} imagesArray - Mảng images từ API
   * @returns {Array} Mảng images đã xử lý
   */
  processImagesArray(imagesArray) {
    if (!Array.isArray(imagesArray)) return [];

    return imagesArray
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((img) => ({
        url: img.url || "",
        alt: img.alt || "",
        order: img.order || 0,
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
      metaTitle: seoData.metaTitle || "Machinery - Saigon 3 Jean",
      metaDescription:
        seoData.metaDescription ||
        "Discover Saigon 3 Jean advanced machinery: laser machines, wash machines, and precision programming systems for consistent denim production.",
      keywords: Array.isArray(seoData.keywords)
        ? seoData.keywords
        : [
            "machinery",
            "laser machine",
            "wash machine",
            "precision programming",
            "denim production",
          ],
    };
  }

  /**
   * Lấy dữ liệu stages riêng biệt
   * @returns {Promise<Array>} Danh sách stages
   */
  async getStages() {
    try {
      const response = await machineryApi.getStages();
      if (!response.success) {
        throw new Error("Failed to fetch stages");
      }
      return this.processStagesData(response.data);
    } catch (error) {
      console.error("MachineryService - Error getting stages:", error);
      return this.getDefaultStages();
    }
  }

  /**
   * Lấy machines theo stage
   * @param {number} stageNumber - Số thứ tự stage
   * @returns {Promise<Array>} Danh sách machines
   */
  async getMachinesByStage(stageNumber) {
    try {
      const response = await machineryApi.getMachinesByStage(stageNumber);
      if (!response.success) {
        throw new Error("Failed to fetch machines by stage");
      }
      return this.processMachinesData(response.data);
    } catch (error) {
      console.error(
        "MachineryService - Error getting machines by stage:",
        error
      );
      return [];
    }
  }

  /**
   * Cập nhật stages
   * @param {Array} stages - Danh sách stages
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateStages(stages) {
    try {
      const response = await machineryApi.updateStages(stages);
      return response;
    } catch (error) {
      console.error("MachineryService - Error updating stages:", error);
      throw error;
    }
  }

  /**
   * Tạo machine data cho JavaScript logic (tương tự term.js)
   * @param {Array} stages - Dữ liệu stages đã xử lý
   * @returns {Object} Machine data object cho JavaScript
   */
  createMachineDataForJS(stages) {
    const machineData = {};

    stages.forEach((stage) => {
      const stageKey = `stage-${stage.stageNumber}`;
      machineData[stageKey] = stage.machines.map((machine) => ({
        id: machine.name.toLowerCase().replace(/\s+/g, ""),
        name: machine.name,
        image: machine.image,
        description: machine.description,
      }));
    });

    return machineData;
  }

  // Dữ liệu mặc định khi API fail
  getDefaultMachineryData() {
    return {
      pageTitle:
        "APPLICATION OF PRECISE PROGRAMMING, ENSURING CONSISTENCY IN PRODUCTION",
      pageDescription:
        "Advanced machinery and precise programming systems for consistent, high-quality denim production",
      stages: this.getDefaultStages(),
      seo: this.getDefaultSeoData(),
    };
  }

  getDefaultStages() {
    return [
      {
        id: "default-1",
        stageNumber: 1,
        title: "STAGE 1",
        description:
          "Application of precise programming, ensuring consistency in production",
        machines: [
          {
            id: "default-lazer-1",
            name: "LAZER MACHINE",
            description:
              "Lazer machine with advanced technology, helping to optimize production processes and ensure the highest quality of products.",
            image: "/images/machinery-page/lazer_machine.png",
            imageAlt: "Lazer Machine",
            order: 1,
            isActive: true,
          },
          {
            id: "default-wash-1",
            name: "WASH MACHINE",
            description:
              "Industrial wash machine with advanced technology, helping to optimize production processes and ensure the highest quality of products.",
            image: "/images/machinery-page/wash_machine.png",
            imageAlt: "Wash Machine",
            order: 2,
            isActive: true,
          },
        ],
        order: 1,
        isActive: true,
      },
      {
        id: "default-2",
        stageNumber: 2,
        title: "STAGE 2",
        description:
          "Application of precise programming, ensuring consistency in production",
        machines: [
          {
            id: "default-cutting-2",
            name: "CUTTING MACHINE",
            description:
              "Precision cutting machine for accurate fabric preparation and minimal waste.",
            image: "/images/machinery-page/cutting_machine.png",
            imageAlt: "Cutting Machine",
            order: 1,
            isActive: true,
          },
        ],
        order: 2,
        isActive: true,
      },
      {
        id: "default-3",
        stageNumber: 3,
        title: "STAGE 3",
        description:
          "Application of precise programming, ensuring consistency in production",
        machines: [
          {
            id: "default-sewing-3",
            name: "SEWING MACHINE",
            description:
              "High-speed industrial sewing machines for consistent stitching quality.",
            image: "/images/machinery-page/sewing_machine.png",
            imageAlt: "Sewing Machine",
            order: 1,
            isActive: true,
          },
        ],
        order: 3,
        isActive: true,
      },
      {
        id: "default-4",
        stageNumber: 4,
        title: "STAGE 4",
        description:
          "Application of precise programming, ensuring consistency in production",
        machines: [
          {
            id: "default-finishing-4",
            name: "FINISHING MACHINE",
            description:
              "Final processing machines for product finishing and quality assurance.",
            image: "/images/machinery-page/finishing_machine.png",
            imageAlt: "Finishing Machine",
            order: 1,
            isActive: true,
          },
        ],
        order: 4,
        isActive: true,
      },
    ];
  }

  getDefaultSeoData() {
    return {
      metaTitle: "Machinery - Saigon 3 Jean",
      metaDescription:
        "Discover Saigon 3 Jean advanced machinery: laser machines, wash machines, and precision programming systems for consistent denim production.",
      keywords: [
        "machinery",
        "laser machine",
        "wash machine",
        "precision programming",
        "denim production",
      ],
    };
  }
}

// Export instance của service
const machineryService = new MachineryService();
export default machineryService;
