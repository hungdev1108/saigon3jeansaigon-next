import productsApi from "../api/productsApi";
import { getOptimizedImageUrls } from "../shared/imageUtils";

/**
 * Service để xử lý dữ liệu products
 */
class ProductsService {
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

    // Sử dụng getOptimizedImageUrls đã import ở đầu file

    return imagesData
      .filter((image) => image.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((image) => {
        // Lấy URL ảnh hoặc dùng ảnh mặc định
        const imageUrl = image.url || "/uploads/images/placeholder-product.jpg";
        
        // Tạo các phiên bản tối ưu của ảnh
        const optimizedUrls = getOptimizedImageUrls(imageUrl);
        
        return {
          id: image._id || "",
          url: imageUrl, // Giữ lại URL gốc để tương thích ngược
          alt: image.alt || "Product Image",
          order: image.order || 0,
          isActive: image.isActive !== false,
          // Thêm các phiên bản tối ưu của ảnh
          optimizedUrls: optimizedUrls
        };
      });
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
            url: "/uploads/images/product-page/denim_1.jpg",
            alt: "Denim Gallery 1",
            order: 1,
            isActive: true,
          },
          {
            id: "default-denim-2",
            url: "/uploads/images/product-page/denim_2.jpg",
            alt: "Denim Gallery 2",
            order: 2,
            isActive: true,
          },
          {
            id: "default-denim-3",
            url: "/uploads/images/product-page/denim_3.jpg",
            alt: "Denim Gallery 3",
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
        id: "default-knit",
        name: "KNIT",
        slug: "knit",
        galleryImages: [
          {
            id: "default-knit-1",
            url: "/uploads/images/product-page/knit_1.jpg",
            alt: "Knit Gallery 1",
            order: 1,
            isActive: true,
          },
          {
            id: "default-knit-2",
            url: "/uploads/images/product-page/knit_2.jpg",
            alt: "Knit Gallery 2",
            order: 2,
            isActive: true,
          },
          {
            id: "default-knit-3",
            url: "/uploads/images/product-page/knit_3.jpg",
            alt: "Knit Gallery 3",
            order: 3,
            isActive: true,
          },
        ],
        carouselSettings: {
          interval: 3500,
          autoplay: true,
          showIndicators: false,
          showControls: true,
        },
        order: 2,
        isActive: true,
      },
      {
        id: "default-woven",
        name: "WOVEN",
        slug: "woven",
        galleryImages: [
          {
            id: "default-woven-1",
            url: "/uploads/images/product-page/woven_1.jpg",
            alt: "Woven Gallery 1",
            order: 1,
            isActive: true,
          },
          {
            id: "default-woven-2",
            url: "/uploads/images/product-page/woven_2.jpg",
            alt: "Woven Gallery 2",
            order: 2,
            isActive: true,
          },
        ],
        carouselSettings: {
          interval: 4000,
          autoplay: true,
          showIndicators: true,
          showControls: true,
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
        productData.mainImage || "/images/placeholder-product.jpg",
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
        id: feature._id || feature.id || "",
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
      .map((app, index) => {
        // Process images array if available, fallback to single image
        let processedImages = [];
        if (app.content?.images && Array.isArray(app.content.images)) {
          processedImages = app.content.images
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((img) => ({
              url: img.url || "",
              alt: img.alt || `${app.title} Image`,
              order: img.order || 1,
            }));
        }

        return {
          id: app._id || `app-${index}`,
          title: app.title || "",
          content: {
            heading: app.content?.heading || app.title || "",
            description: app.content?.description || "",
            features: Array.isArray(app.content?.features)
              ? app.content.features
              : [],
            // Use first image from images array if available, fallback to single image field
            image: processedImages.length > 0 
              ? processedImages[0].url 
              : (app.content?.image || "/uploads/images/placeholder-application.jpg"),
            imageAlt: processedImages.length > 0 
              ? processedImages[0].alt 
              : (app.content?.imageAlt || `${app.title} Image`),
            // Add images array for potential future use
            images: processedImages,
          },
          order: app.order || index + 1,
          accordionId: `application${index + 1}`,
          isExpanded: index === 0, // Mở accordion đầu tiên
        };
      });
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
        "High-quality denim products with advanced fabric technology.",
      mainImage: "/uploads/images/product-page/denim_main.jpg",
      mainImageAlt: "Denim Main Image",
      galleryImages: [
        {
          id: "default-gallery-1",
          url: "/uploads/images/product-page/denim_1.jpg",
          alt: "Denim Gallery 1",
          order: 1,
          isActive: true,
        },
        {
          id: "default-gallery-2",
          url: "/uploads/images/product-page/denim_2.jpg",
          alt: "Denim Gallery 2",
          order: 2,
          isActive: true,
        },
        {
          id: "default-gallery-3",
          url: "/uploads/images/product-page/denim_3.jpg",
          alt: "Denim Gallery 3",
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
        icon: "fas fa-cogs",
        text: "Advanced stitching technology",
        order: 1,
      },
      {
        id: "feature-2",
        icon: "fas fa-leaf",
        text: "Eco-friendly materials",
        order: 2,
      },
      {
        id: "feature-3",
        icon: "fas fa-tachometer-alt",
        text: "Fast production cycles",
        order: 3,
      },
      {
        id: "feature-4",
        icon: "fas fa-shield-alt",
        text: "Durability and performance",
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
        title: "Urban Wear",
        content: {
          heading: "Urban Denim Fashion",
          description:
            "Designed for modern street style with durability.",
          features: [
            "Breathable material",
            "Fade-resistant",
            "Durable seams",
          ],
          image: "/uploads/images/product-page/knit_1.png",
          imageAlt: "Urban Denim",
          images: [
            {
              url: "/uploads/images/product-page/knit_1.png",
              alt: "Application Image 1",
              order: 1,
            },
            {
              url: "/uploads/images/product-page/knit_1.png",
              alt: "Application Image 2",
              order: 2,
            },
            {
              url: "/uploads/images/product-page/knit_1.png",
              alt: "Application Image 3",
              order: 3,
            },
          ],
        },
        order: 1,
        accordionId: "application1",
        isExpanded: true,
      },
      {
        id: "app-2",
        title: "Workwear Applications",
        content: {
          heading: "Durable Denim for Workwear",
          description:
            "Engineered for strength and flexibility in demanding work environments.",
          features: [
            "Reinforced stitching",
            "Comfort-fit design",
            "Heavy-duty fabric",
          ],
          image: "/uploads/images/product-page/knit_1.png",
          imageAlt: "Workwear Denim",
          images: [
            {
              url: "/uploads/images/product-page/knit_1.png",
              alt: "Application Image 1",
              order: 1,
            },
            {
              url: "/uploads/images/product-page/knit_1.png",
              alt: "Application Image 2",
              order: 2,
            },
            {
              url: "/uploads/images/product-page/knit_1.png",
              alt: "Application Image 3",
              order: 3,
            },
          ],
        },
        order: 2,
        accordionId: "application2",
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
      metaTitle: "Denim Products - Saigon 3 Jean",
      metaDescription:
        "Explore high-quality denim products made with eco-friendly materials and modern technology.",
      keywords: ["denim", "jeans", "eco-friendly", "durable", "streetwear", "workwear"],
    };
  }
}

// Export instance của service
const productsService = new ProductsService();
export default productsService;
