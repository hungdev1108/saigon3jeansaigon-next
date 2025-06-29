import { getHomeData } from "../api/homeApi";

/**
 * Service để xử lý dữ liệu home
 */
class HomeService {
  /**
   * Lấy và xử lý tất cả dữ liệu cho trang home
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteHomeData() {
    try {
      const response = await getHomeData();

      if (!response.success) {
        throw new Error("Failed to fetch home data");
      }

      const { data } = response;
      // console.log("🔄 Đang tải dữ liệu trang chủ...");
      // console.log(data);
      // console.log("✅ Tải dữ liệu thành công từ API");

      // Xử lý và format dữ liệu nếu cần
      return {
        hero: this.processHeroData(data.hero),
        sections: this.processSectionsData(data.sections),
        customers: this.processCustomersData(data.customers),
        certifications: this.processCertificationsData(data.certifications),
        featuredNews: this.processNewsData(data.featuredNews),
      };
    } catch (error) {
      console.error(
        "❌ HomeService - Error getting complete home data:",
        error.message
      );

      // Kiểm tra loại lỗi
      if (error.code === "ECONNREFUSED") {
        console.warn(
          "🔌 Backend server không khả dụng, sử dụng dữ liệu mặc định"
        );
      } else if (error.code === "ECONNABORTED") {
        console.warn("⏱️ API timeout, sử dụng dữ liệu mặc định");
      } else {
        console.warn("🚨 Lỗi API khác, sử dụng dữ liệu mặc định");
      }

      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultHomeData();
    }
  }

  /**
   * Xử lý dữ liệu hero section
   * @param {Object} heroData - Dữ liệu hero từ API
   * @returns {Object} Dữ liệu hero đã xử lý
   */
  processHeroData(heroData) {
    if (!heroData) return this.getDefaultHeroData();

    return {
      title: heroData.title || "WELCOME TO SAIGON 3 JEAN",
      subtitle: heroData.subtitle || "Leading garment manufacturer in Vietnam",
      backgroundImage:
        heroData.backgroundImage || "/images/home_banner-section2.jpg",
      videoUrl: heroData.videoUrl || "",
      isActive: heroData.isActive !== false,
    };
  }

  /**
   * Xử lý dữ liệu sections (3 cards)
   * @param {Array} sectionsData - Dữ liệu sections từ API
   * @returns {Array} Dữ liệu sections đã xử lý
   */
  processSectionsData(sectionsData) {
    if (!Array.isArray(sectionsData)) return this.getDefaultSectionsData();

    return sectionsData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((section) => ({
        title: section.title || "",
        content: section.content || "",
        mediaType: section.mediaType || "image",
        mediaUrl: section.mediaUrl || "/images/home_banner-section2.jpg",
        buttonText: section.buttonText || "LEARN MORE",
        buttonLink: section.buttonLink || "#",
        backgroundColor: section.backgroundColor || "#007bff",
        order: section.order || 0,
      }));
  }

  /**
   * Xử lý dữ liệu customers
   * @param {Object} customersData - Dữ liệu customers từ API
   * @returns {Object} Dữ liệu customers đã xử lý
   */
  processCustomersData(customersData) {
    if (!customersData) return this.getDefaultCustomersData();

    return {
      denimWoven: this.processCustomerList(customersData.denimWoven),
      knit: this.processCustomerList(customersData.knit),
    };
  }

  /**
   * Xử lý danh sách customer
   * @param {Array} customerList - Danh sách customer
   * @returns {Array} Danh sách customer đã xử lý
   */
  processCustomerList(customerList) {
    if (!Array.isArray(customerList)) return [];

    return customerList
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((customer) => ({
        name: customer.name || "",
        logo: customer.logo || "/images/placeholder-logo.png",
        website: customer.website || "",
        order: customer.order || 0,
      }));
  }

  /**
   * Xử lý dữ liệu certifications
   * @param {Array} certificationsData - Dữ liệu certifications từ API
   * @returns {Array} Dữ liệu certifications đã xử lý
   */
  processCertificationsData(certificationsData) {
    if (!Array.isArray(certificationsData))
      return this.getDefaultCertificationsData();

    return certificationsData
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((cert) => ({
        name: cert.name || "",
        description: cert.description || "",
        image: cert.image || "/images/placeholder-cert.png",
        category: cert.category || "general",
        order: cert.order || 0,
        issuedDate: cert.issuedDate || null,
      }));
  }

  /**
   * Xử lý dữ liệu news
   * @param {Array} newsData - Dữ liệu news từ API
   * @returns {Array} Dữ liệu news đã xử lý
   */
  processNewsData(newsData) {
    if (!Array.isArray(newsData)) return this.getDefaultNewsData();

    return newsData
      .filter((news) => news.isPublished && news.isFeatured)
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .map((news) => ({
        id: news._id || "",
        title: news.title || "",
        excerpt: news.excerpt || "",
        image: news.image || "/images/placeholder-news.jpg",
        publishDate: news.publishDate || new Date().toISOString(),
        slug: news.slug || "",
        tags: news.tags || [],
        author: news.author || "Saigon 3 Jean",
      }));
  }

  // Dữ liệu mặc định khi API fail
  getDefaultHomeData() {
    return {
      hero: this.getDefaultHeroData(),
      sections: this.getDefaultSectionsData(),
      customers: this.getDefaultCustomersData(),
      certifications: this.getDefaultCertificationsData(),
      featuredNews: this.getDefaultNewsData(),
    };
  }

  getDefaultHeroData() {
    return {
      title: "WELCOME TO SAIGON 3 JEAN",
      subtitle: "Leading garment manufacturer in Vietnam",
      backgroundImage: "/images/home_banner-section2.jpg",
      videoUrl: "",
      isActive: true,
    };
  }

  getDefaultSectionsData() {
    return [
      {
        title: "FASHION-DRIVEN MANUFACTURING IN VIETNAM",
        content:
          "Our state-of-the-art facilities provide high-quality garment production with advanced technologies.",
        mediaType: "video",
        mediaUrl: "/videos/SAIGON_3_JEAN.mp4",
        buttonText: "WATCH VIDEO",
        buttonLink: "#",
        backgroundColor: "#1e40af",
        order: 1,
      },
      {
        title: "SUSTAINABLE PRODUCTION",
        content:
          "Committed to eco-friendly practices and sustainable manufacturing processes.",
        mediaType: "image",
        mediaUrl: "/images/home_banner-section2.jpg",
        buttonText: "LEARN MORE",
        buttonLink: "#",
        backgroundColor: "#059669",
        order: 2,
      },
      {
        title: "ENERGY INFRASTRUCTURE",
        content:
          "Optimized energy solutions for efficient and sustainable manufacturing operations.",
        mediaType: "image",
        mediaUrl: "/images/home_banner-section2.jpg",
        buttonText: "LEARN MORE",
        buttonLink: "#",
        backgroundColor: "#dc2626",
        order: 3,
      },
    ];
  }

  getDefaultCustomersData() {
    return {
      denimWoven: [
        {
          name: "UNIQLO",
          logo: "/images/branding_our_customer/uniqlo.png",
          website: "",
          order: 1,
        },
        {
          name: "MUJI",
          logo: "/images/branding_our_customer/muji.png",
          website: "",
          order: 2,
        },
        {
          name: "RODD & GUNN",
          logo: "/images/branding_our_customer/rodd&gunn.png",
          website: "",
          order: 3,
        },
        {
          name: "GAZ MAN",
          logo: "/images/branding_our_customer/gazman.png",
          website: "",
          order: 4,
        },
      ],
      knit: [
        {
          name: "chico's",
          logo: "/images/branding_our_customer/chico.png",
          website: "",
          order: 1,
        },
        {
          name: "drew house",
          logo: "/images/branding_our_customer/drewhouse.png",
          website: "",
          order: 2,
        },
        {
          name: "THE LOYALIST",
          logo: "/images/branding_our_customer/the loyalist.png",
          website: "",
          order: 3,
        },
        {
          name: "GOLF",
          logo: "/images/branding_our_customer/golf.png",
          website: "",
          order: 4,
        },
      ],
    };
  }

  getDefaultCertificationsData() {
    return [
      {
        name: "LEED GOLD",
        description: "Leadership in Energy & Environmental Design",
        image: "/images/certification/leed_gold.png",
        category: "environmental",
        order: 1,
      },
      {
        name: "ISO 9001:2015",
        description: "Quality Management System",
        image: "/images/certification/certificate.png",
        category: "quality",
        order: 2,
      },
    ];
  }

  getDefaultNewsData() {
    return [
      {
        id: "1",
        title:
          "SAIGON 3 JEAN ACHIEVES LEED GOLD CERTIFICATION FOR GREEN MANUFACTURING",
        excerpt:
          "Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification, reinforcing our commitment to sustainable development and environmental responsibility.",
        image: "/images/news/post_2.png",
        publishDate: "2025-05-08",
        slug: "leed-gold-certification",
        tags: ["sustainability", "certification"],
        author: "Saigon 3 Jean",
      },
    ];
  }
}

// Export singleton instance
export default new HomeService();
