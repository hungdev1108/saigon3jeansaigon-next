import productsApi from "../api/productsApi";
import {BACKEND_DOMAIN} from '../api/config';

/**
 * Service để xử lý dữ liệu products
 */
class ProductsService {
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
   * Lấy và xử lý tất cả dữ liệu cho trang products
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteProductsData() {
    try {
      const response = await productsApi.getProductsData();

      if (!response.success) {
        throw new Error("Failed to fetch products data");
      }

      const { data } = response;

      // Xử lý và format dữ liệu
      return {
        products: this.processProductsData(data.products),
        totalProducts: data.totalProducts || 0,
      };
    } catch (error) {
      console.error(
        "ProductsService - Error getting complete products data:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultProductsData();
    }
  }

  /**
   * Xử lý dữ liệu products
   * @param {Array} productsData - Dữ liệu products từ API
   * @returns {Array} Dữ liệu products đã xử lý
   */
  processProductsData(productsData) {
    if (!Array.isArray(productsData)) return this.getDefaultProducts();

    return productsData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((product) => ({
        id: product.id || product._id || "",
        name: product.name || "",
        slug: product.slug || "",
        galleryImages: this.processGalleryImages(product.galleryImages),
        carouselSettings: this.processCarouselSettings(
          product.carouselSettings
        ),
        order: product.order || 0,
        isActive: product.isActive !== false,
      }));
  }

  /**
   * Xử lý dữ liệu gallery images
   * @param {Array} imagesData - Dữ liệu hình ảnh từ API
   * @returns {Array} Dữ liệu hình ảnh đã xử lý
   */
  processGalleryImages(imagesData) {
    if (!Array.isArray(imagesData)) return [];

    return imagesData
      .filter((image) => image.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((image) => ({
        id: image._id || "",
        url: this.fixImagePath(image.url) || "/images/placeholder-product.jpg",
        alt: image.alt || "Product Image",
        order: image.order || 0,
        isActive: image.isActive !== false,
      }));
  }

  /**
   * Xử lý cài đặt carousel
   * @param {Object} carouselData - Dữ liệu carousel từ API
   * @returns {Object} Cài đặt carousel đã xử lý
   */
  processCarouselSettings(carouselData) {
    if (!carouselData) return this.getDefaultCarouselSettings();

    return {
      interval: carouselData.interval || 3000,
      autoplay: carouselData.autoplay !== false,
      showIndicators: carouselData.showIndicators !== false,
      showControls: carouselData.showControls || false,
    };
  }

  /**
   * Lấy dữ liệu products riêng biệt
   * @returns {Promise<Array>} Danh sách products
   */
  async getProducts() {
    try {
      const response = await productsApi.getProducts();
      if (!response.success) {
        throw new Error("Failed to fetch products");
      }
      return this.processProductsData(response.data);
    } catch (error) {
      console.error("ProductsService - Error getting products:", error);
      return this.getDefaultProducts();
    }
  }

  /**
   * Lấy product theo ID
   * @param {string} productId - ID của product
   * @returns {Promise<Object>} Thông tin product
   */
  async getProductById(productId) {
    try {
      const response = await productsApi.getProductById(productId);
      if (!response.success) {
        throw new Error("Failed to fetch product");
      }
      return this.processProductsData([response.data])[0];
    } catch (error) {
      console.error("ProductsService - Error getting product by ID:", error);
      return null;
    }
  }

  /**
   * Lấy product theo slug
   * @param {string} slug - Slug của product
   * @returns {Promise<Object>} Thông tin product
   */
  async getProductBySlug(slug) {
    try {
      const response = await productsApi.getProductBySlug(slug);
      if (!response.success) {
        throw new Error("Failed to fetch product");
      }
      return this.processProductsData([response.data])[0];
    } catch (error) {
      console.error("ProductsService - Error getting product by slug:", error);
      return null;
    }
  }

  /**
   * Tạo carousel ID duy nhất cho mỗi product
   * @param {string} productSlug - Slug của product
   * @returns {string} Carousel ID
   */
  generateCarouselId(productSlug) {
    return `${productSlug}Carousel`;
  }

  /**
   * Tạo carousel target selector
   * @param {string} productSlug - Slug của product
   * @returns {string} Carousel target
   */
  generateCarouselTarget(productSlug) {
    return `#${this.generateCarouselId(productSlug)}`;
  }

  /**
   * Kiểm tra xem product có hình ảnh không
   * @param {Object} product - Thông tin product
   * @returns {boolean} True nếu có hình ảnh
   */
  hasImages(product) {
    return product.galleryImages && product.galleryImages.length > 0;
  }

  /**
   * Lấy hình ảnh đầu tiên của product
   * @param {Object} product - Thông tin product
   * @returns {Object|null} Hình ảnh đầu tiên hoặc null
   */
  getFirstImage(product) {
    if (!this.hasImages(product)) return null;
    return product.galleryImages[0];
  }

  /**
   * Cập nhật products
   * @param {Array} products - Danh sách products
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateProducts(products) {
    try {
      // Implement update logic if needed
      console.log("ProductsService - Update products:", products);
      return { success: true };
    } catch (error) {
      console.error("ProductsService - Error updating products:", error);
      throw error;
    }
  }

  // Dữ liệu mặc định khi API fail
  getDefaultProductsData() {
    return {
      products: this.getDefaultProducts(),
      totalProducts: 3,
    };
  }

  getDefaultProducts() {
    return [
      {
        id: "default-denim",
        name: "DENIM",
        slug: "denim",
        galleryImages: [
          {
            id: "default-denim-1",
            url: "/images/product-page/denim_1.png",
            alt: "Denim Products 1",
            order: 1,
            isActive: true,
          },
          {
            id: "default-denim-2",
            url: "/images/product-page/denim_2.png",
            alt: "Denim Products 2",
            order: 2,
            isActive: true,
          },
          {
            id: "default-denim-3",
            url: "/images/product-page/denim_3.png",
            alt: "Denim Products 3",
            order: 3,
            isActive: true,
          },
        ],
        carouselSettings: {
          interval: 3000,
          autoplay: true,
          showIndicators: true,
          showControls: false,
        },
        order: 1,
        isActive: true,
      },
      {
        id: "default-woven",
        name: "WOVEN",
        slug: "woven",
        galleryImages: [
          {
            id: "default-woven-1",
            url: "/images/product-page/woven_1.png",
            alt: "Woven Products 1",
            order: 1,
            isActive: true,
          },
          {
            id: "default-woven-2",
            url: "/images/product-page/woven_2.png",
            alt: "Woven Products 2",
            order: 2,
            isActive: true,
          },
          {
            id: "default-woven-3",
            url: "/images/product-page/woven_3.png",
            alt: "Woven Products 3",
            order: 3,
            isActive: true,
          },
        ],
        carouselSettings: {
          interval: 3500,
          autoplay: true,
          showIndicators: true,
          showControls: false,
        },
        order: 2,
        isActive: true,
      },
      {
        id: "default-knit",
        name: "KNIT",
        slug: "knit",
        galleryImages: [
          {
            id: "default-knit-1",
            url: "/images/product-page/knit_1.png",
            alt: "Knit Products 1",
            order: 1,
            isActive: true,
          },
          {
            id: "default-knit-2",
            url: "/images/product-page/knit_2.png",
            alt: "Knit Products 2",
            order: 2,
            isActive: true,
          },
          {
            id: "default-knit-3",
            url: "/images/product-page/knit_3.png",
            alt: "Knit Products 3",
            order: 3,
            isActive: true,
          },
        ],
        carouselSettings: {
          interval: 4000,
          autoplay: true,
          showIndicators: true,
          showControls: false,
        },
        order: 3,
        isActive: true,
      },
    ];
  }

  getDefaultCarouselSettings() {
    return {
      interval: 3000,
      autoplay: true,
      showIndicators: true,
      showControls: false,
    };
  }

  // ===== METHODS CHO PRODUCT DETAILS PAGE =====

  /**
   * Lấy và xử lý chi tiết product cho trang product details
   * @param {string} productId - ID của product
   * @returns {Promise<Object>} Chi tiết product đã được xử lý
   */
  async getProductDetails(productId) {
    try {
      const response = await productsApi.getProductDetails(productId);

      if (!response.success) {
        throw new Error("Failed to fetch product details");
      }

      return this.processProductDetails(response.data);
    } catch (error) {
      console.error("ProductsService - Error getting product details:", error);
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultProductDetails(productId);
    }
  }

  /**
   * Lấy chi tiết product theo slug
   * @param {string} slug - Slug của product
   * @returns {Promise<Object>} Chi tiết product đã được xử lý
   */
  async getProductDetailsBySlug(slug) {
    try {
      const response = await productsApi.getProductDetailsBySlug(slug);

      if (!response.success) {
        throw new Error("Failed to fetch product details by slug");
      }

      return this.processProductDetails(response.data);
    } catch (error) {
      console.error(
        "ProductsService - Error getting product details by slug:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultProductDetails(null, slug);
    }
  }

  /**
   * Xử lý dữ liệu chi tiết product
   * @param {Object} productData - Dữ liệu product từ API
   * @returns {Object} Dữ liệu product đã xử lý
   */
  processProductDetails(productData) {
    if (!productData) return this.getDefaultProductDetails();

    return {
      id: productData._id || productData.id || "",
      name: productData.name || "",
      slug: productData.slug || "",
      description: productData.description || "",
      mainImage:
        this.fixImagePath(productData.mainImage) ||
        "/images/placeholder-product.jpg",
      mainImageAlt: productData.mainImageAlt || `${productData.name} Products`,
      galleryImages: this.processGalleryImages(productData.galleryImages),
      features: this.processProductFeatures(productData.features),
      applications: this.processProductApplications(productData.applications),
      carouselSettings: this.processCarouselSettings(
        productData.carouselSettings
      ),
      seo: this.processProductSEO(productData.seo),
      order: productData.order || 0,
      isActive: productData.isActive !== false,
      isFeatured: productData.isFeatured || false,
      createdAt: productData.createdAt || null,
      updatedAt: productData.updatedAt || null,
    };
  }

  /**
   * Xử lý dữ liệu features của product
   * @param {Array} featuresData - Dữ liệu features từ API
   * @returns {Array} Dữ liệu features đã xử lý
   */
  processProductFeatures(featuresData) {
    if (!Array.isArray(featuresData)) return this.getDefaultProductFeatures();

    return featuresData
      .filter((feature) => feature.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((feature) => ({
        id: feature._id || "",
        icon: feature.icon || "fas fa-check",
        text: feature.text || "",
        order: feature.order || 0,
      }));
  }

  /**
   * Xử lý dữ liệu applications của product
   * @param {Array} applicationsData - Dữ liệu applications từ API
   * @returns {Array} Dữ liệu applications đã xử lý
   */
  processProductApplications(applicationsData) {
    if (!Array.isArray(applicationsData))
      return this.getDefaultProductApplications();

    return applicationsData
      .filter((app) => app.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((app, index) => ({
        id: app._id || `app-${index}`,
        title: app.title || "",
        content: {
          heading: app.content?.heading || app.title || "",
          description: app.content?.description || "",
          features: Array.isArray(app.content?.features)
            ? app.content.features
            : [],
          image:
            this.fixImagePath(app.content?.image) ||
            "/images/placeholder-application.jpg",
          imageAlt: app.content?.imageAlt || `${app.title} Image`,
        },
        order: app.order || index + 1,
        accordionId: `application${index + 1}`,
        isExpanded: index === 0, // Mở accordion đầu tiên
      }));
  }

  /**
   * Xử lý dữ liệu SEO của product
   * @param {Object} seoData - Dữ liệu SEO từ API
   * @returns {Object} Dữ liệu SEO đã xử lý
   */
  processProductSEO(seoData) {
    if (!seoData) return this.getDefaultProductSEO();

    return {
      metaTitle: seoData.metaTitle || "",
      metaDescription: seoData.metaDescription || "",
      keywords: Array.isArray(seoData.keywords) ? seoData.keywords : [],
    };
  }

  /**
   * Lấy các product liên quan
   * @param {string} productId - ID của product hiện tại
   * @param {number} limit - Số lượng product liên quan
   * @returns {Promise<Array>} Danh sách product liên quan
   */
  async getRelatedProducts(productId, limit = 3) {
    try {
      const response = await productsApi.getRelatedProducts(productId, limit);
      if (!response.success) {
        throw new Error("Failed to fetch related products");
      }
      return this.processProductsData(response.data);
    } catch (error) {
      console.error("ProductsService - Error getting related products:", error);
      return [];
    }
  }

  /**
   * Kiểm tra xem product có applications không
   * @param {Object} product - Thông tin product
   * @returns {boolean} True nếu có applications
   */
  hasApplications(product) {
    return product.applications && product.applications.length > 0;
  }

  /**
   * Kiểm tra xem product có features không
   * @param {Object} product - Thông tin product
   * @returns {boolean} True nếu có features
   */
  hasFeatures(product) {
    return product.features && product.features.length > 0;
  }

  /**
   * Tạo URL cho trang product details
   * @param {string} slug - Slug của product
   * @returns {string} URL trang product details
   */
  getProductDetailsUrl(slug) {
    return `/product-details/${slug}`;
  }

  // ===== DEFAULT DATA CHO PRODUCT DETAILS =====

  /**
   * Dữ liệu mặc định cho product details
   * @param {string} productId - ID của product
   * @param {string} slug - Slug của product
   * @returns {Object} Dữ liệu product details mặc định
   */
  getDefaultProductDetails(productId = "default-denim", slug = "denim") {
    return {
      id: productId,
      name: "DENIM",
      slug: slug,
      description:
        "Sensors continuously record data on chemical levels, temperature, pressure, and flow rate. The system integrates remote management and control through a digital interface, processing data to optimize chemical ratios and make automatic adjustments.",
      mainImage: "/images/product-page/denim_1.png",
      mainImageAlt: "DENIM Products",
      galleryImages: [
        {
          id: "default-gallery-1",
          url: "/images/product-page/denim_1.png",
          alt: "Denim Products 1",
          order: 1,
          isActive: true,
        },
        {
          id: "default-gallery-2",
          url: "/images/product-page/denim_2.png",
          alt: "Denim Products 2",
          order: 2,
          isActive: true,
        },
        {
          id: "default-gallery-3",
          url: "/images/product-page/denim_3.png",
          alt: "Denim Products 3",
          order: 3,
          isActive: true,
        },
      ],
      features: this.getDefaultProductFeatures(),
      applications: this.getDefaultProductApplications(),
      carouselSettings: this.getDefaultCarouselSettings(),
      seo: this.getDefaultProductSEO(),
      order: 1,
      isActive: true,
      isFeatured: false,
      createdAt: null,
      updatedAt: null,
    };
  }

  /**
   * Features mặc định cho product
   * @returns {Array} Danh sách features mặc định
   */
  getDefaultProductFeatures() {
    return [
      {
        id: "feature-1",
        icon: "fas fa-chart-line",
        text: "Sensors continuously record data on chemical levels, temperature, pressure, and flow rate.",
        order: 1,
      },
      {
        id: "feature-2",
        icon: "fas fa-cogs",
        text: "The system integrates advanced manufacturing processes.",
        order: 2,
      },
      {
        id: "feature-3",
        icon: "fas fa-wifi",
        text: "Remote management and control through a digital interface.",
        order: 3,
      },
      {
        id: "feature-4",
        icon: "fas fa-brain",
        text: "Processing data to optimize chemical ratios and make automatic adjustments.",
        order: 4,
      },
    ];
  }

  /**
   * Applications mặc định cho product
   * @returns {Array} Danh sách applications mặc định
   */
  getDefaultProductApplications() {
    return [
      {
        id: "app-1",
        title: "Advanced Manufacturing Process",
        content: {
          heading: "Advanced Manufacturing Process",
          description:
            "Our denim manufacturing utilizes cutting-edge technology to ensure consistent quality and sustainable practices. The automated systems monitor every aspect of production from fiber selection to final finishing.",
          features: [
            "Real-time quality monitoring",
            "Automated color matching",
            "Precision cutting technology",
            "Environmental compliance tracking",
          ],
          image: "/images/product-page/denim_2.png",
          imageAlt: "Advanced Manufacturing Process",
        },
        order: 1,
        accordionId: "application1",
        isExpanded: true,
      },
      {
        id: "app-2",
        title: "Quality Control & Testing",
        content: {
          heading: "Quality Control & Testing",
          description:
            "Comprehensive quality assurance protocols ensure every piece meets our high standards. Advanced testing equipment validates durability, comfort, and appearance retention.",
          features: [
            "Tensile strength testing",
            "Color fastness verification",
            "Shrinkage analysis",
            "Wear resistance evaluation",
          ],
          image: "/images/product-page/denim_3.png",
          imageAlt: "Quality Control & Testing",
        },
        order: 2,
        accordionId: "application2",
        isExpanded: false,
      },
      {
        id: "app-3",
        title: "Sustainable Production",
        content: {
          heading: "Sustainable Production",
          description:
            "Environmental responsibility is at the core of our operations. We implement eco-friendly processes and materials to minimize our environmental footprint while maintaining product excellence.",
          features: [
            "Water recycling systems",
            "Organic cotton sourcing",
            "Chemical-free treatments",
            "Renewable energy usage",
          ],
          image: "/images/product-page/denim_4.png",
          imageAlt: "Sustainable Production",
        },
        order: 3,
        accordionId: "application3",
        isExpanded: false,
      },
      {
        id: "app-4",
        title: "Innovation & Research",
        content: {
          heading: "Innovation & Research",
          description:
            "Continuous research and development drive our innovation in denim technology. Our R&D team works on developing new fabrics, treatments, and production methods.",
          features: [
            "Fabric innovation labs",
            "Treatment technology research",
            "Performance enhancement studies",
            "Future trend analysis",
          ],
          image: "/images/product-page/denim_5.png",
          imageAlt: "Research & Innovation",
        },
        order: 4,
        accordionId: "application4",
        isExpanded: false,
      },
    ];
  }

  /**
   * SEO mặc định cho product
   * @returns {Object} Dữ liệu SEO mặc định
   */
  getDefaultProductSEO() {
    return {
      metaTitle: "DENIM - Saigon 3 Jean",
      metaDescription:
        "Sensors continuously record data on chemical levels, temperature, pressure, and flow rate. The system integrates remote management and control through a digital interface, processing data to optimize chemical ratios and make automatic adjustments.",
      keywords: ["denim", "manufacturing", "quality", "sustainable"],
    };
  }
}

// Export instance của service
const productsService = new ProductsService();
export default productsService;
