import { getHomeData } from "../api/homeApi";

// Define types for the service
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface HeroData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  videoUrl: string;
  isActive: boolean;
}

export interface SectionData {
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  order: number;
}

export interface CustomerItem {
  name: string;
  logo: string;
  website: string;
  order: number;
}

export interface CustomersData {
  denimWoven: CustomerItem[];
  knit: CustomerItem[];
  [key: string]: CustomerItem[];
}

export interface CertificationItem {
  name: string;
  description: string;
  image: string;
  category: string;
  order: number;
  issuedDate: string | null;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  publishDate: string;
  slug: string;
  tags: string[];
  author: string;
  _id?: string;
}

export interface HomeData {
  hero: HeroData;
  sections: SectionData[];
  customers: CustomersData;
  certifications: CertificationItem[];
  featuredNews: NewsItem[];
}

interface FileUploadMap {
  [key: string]: File;
}

/**
 * Service để xử lý dữ liệu home
 */
class HomeService {
  /**
   * Lấy và xử lý tất cả dữ liệu cho trang home
   * @returns Promise<HomeData> Dữ liệu đã được xử lý
   */
  async getCompleteHomeData(): Promise<HomeData> {
    try {
      const response = await getHomeData();

      if (!response.success) {
        throw new Error("Failed to fetch home data");
      }

      const { data } = response;

      // Xử lý và format dữ liệu nếu cần
      return {
        hero: this.processHeroData(data.hero),
        sections: this.processSectionsData(data.sections),
        customers: this.processCustomersData(data.customers),
        certifications: this.processCertificationsData(data.certifications),
        featuredNews: this.processNewsData(data.featuredNews),
      };
    } catch (error: any) {
      console.error(
        "❌ HomeService - Error getting complete home data:",
        error.message
      );

      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultHomeData();
    }
  }

  /**
   * Xử lý dữ liệu hero section
   * @param heroData - Dữ liệu hero từ API
   * @returns HeroData Dữ liệu hero đã xử lý
   */
  processHeroData(heroData: any): HeroData {
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
   * @param sectionsData - Dữ liệu sections từ API
   * @returns SectionData[] Dữ liệu sections đã xử lý
   */
  processSectionsData(sectionsData: any[]): SectionData[] {
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
   * @param customersData - Dữ liệu customers từ API
   * @returns CustomersData Dữ liệu customers đã xử lý
   */
  processCustomersData(customersData: any): CustomersData {
    if (!customersData) return this.getDefaultCustomersData();

    return {
      denimWoven: this.processCustomerList(customersData.denimWoven),
      knit: this.processCustomerList(customersData.knit),
    };
  }

  /**
   * Xử lý danh sách customer
   * @param customerList - Danh sách customer
   * @returns CustomerItem[] Danh sách customer đã xử lý
   */
  processCustomerList(customerList: any[]): CustomerItem[] {
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
   * @param certificationsData - Dữ liệu certifications từ API
   * @returns CertificationItem[] Dữ liệu certifications đã xử lý
   */
  processCertificationsData(certificationsData: any[]): CertificationItem[] {
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
   * @param newsData - Dữ liệu news từ API
   * @returns NewsItem[] Dữ liệu news đã xử lý
   */
  processNewsData(newsData: any[]): NewsItem[] {
    if (!Array.isArray(newsData)) return this.getDefaultNewsData();

    return newsData
      .filter((news) => news.isPublished && news.isFeatured)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .map((news) => ({
        id: news._id || "",
        title: news.title || "",
        excerpt: news.excerpt || "",
        content: news.content || "",
        image: news.image || "/images/placeholder-news.jpg",
        publishDate: news.publishDate || new Date().toISOString(),
        slug: news.slug || "",
        tags: news.tags || [],
        author: news.author || "Saigon 3 Jean",
        _id: news._id,
      }));
  }

  // Dữ liệu mặc định khi API fail
  getDefaultHomeData(): HomeData {
    return {
      hero: this.getDefaultHeroData(),
      sections: this.getDefaultSectionsData(),
      customers: this.getDefaultCustomersData(),
      certifications: this.getDefaultCertificationsData(),
      featuredNews: this.getDefaultNewsData(),
    };
  }

  getDefaultHeroData(): HeroData {
    return {
      title: "WELCOME TO SAIGON 3 JEAN",
      subtitle: "Leading garment manufacturer in Vietnam",
      backgroundImage: "/images/home_banner-section2.jpg",
      videoUrl: "",
      isActive: true,
    };
  }

  getDefaultSectionsData(): SectionData[] {
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

  getDefaultCustomersData(): CustomersData {
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

  getDefaultCertificationsData(): CertificationItem[] {
    return [
      {
        name: "LEED GOLD",
        description: "Leadership in Energy & Environmental Design",
        image: "/images/certification/leed_gold.png",
        category: "environmental",
        order: 1,
        issuedDate: null,
      },
      {
        name: "ISO 9001:2015",
        description: "Quality Management System",
        image: "/images/certification/certificate.png",
        category: "quality",
        order: 2,
        issuedDate: null,
      },
    ];
  }

  getDefaultNewsData(): NewsItem[] {
    return [
      {
        id: "1",
        title:
          "SAIGON 3 JEAN ACHIEVES LEED GOLD CERTIFICATION FOR GREEN MANUFACTURING",
        excerpt:
          "Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification, reinforcing our commitment to sustainable development and environmental responsibility.",
        content: "Full article content goes here...",
        image: "/images/news/post_2.png",
        publishDate: "2025-05-08",
        slug: "leed-gold-certification",
        tags: ["sustainability", "certification"],
        author: "Saigon 3 Jean",
        _id: "1",
      },
    ];
  }

  /**
   * Cập nhật thông tin hero section
   * @param heroData - Dữ liệu hero cần cập nhật
   * @param imageFile - File hình ảnh mới (nếu có)
   * @returns Promise<ApiResponse<HeroData>> Kết quả cập nhật
   */
  async updateHero(heroData: HeroData, imageFile: File | null = null): Promise<ApiResponse<HeroData>> {
    try {
      // Tạm thời trả về giả lập thành công cho dev
      console.log("Updating hero data:", heroData);
      
      if (imageFile) {
        console.log("Image file uploaded:", imageFile.name);
        // Thực hiện xử lý upload file ở đây nếu có backend
      }
      
      // Mock API response
      return {
        success: true,
        message: "Hero section updated successfully",
        data: heroData
      };
    } catch (error: any) {
      console.error("Error updating hero:", error);
      return {
        success: false,
        message: error.message || "Failed to update hero section",
        data: heroData
      };
    }
  }

  /**
   * Cập nhật thông tin các sections
   * @param sectionsData - Dữ liệu sections cần cập nhật
   * @param imageFiles - Object chứa các file hình ảnh mới (key là index, value là File)
   * @returns Promise<ApiResponse<SectionData[]>> Kết quả cập nhật
   */
  async updateHomeSections(sectionsData: SectionData[], imageFiles: FileUploadMap = {}): Promise<ApiResponse<SectionData[]>> {
    try {
      console.log("Updating sections data:", sectionsData);
      
      if (Object.keys(imageFiles).length > 0) {
        console.log("Image files uploaded:", Object.keys(imageFiles).map(k => `${k}:${imageFiles[k].name}`).join(', '));
        // Thực hiện xử lý upload file ở đây nếu có backend
      }
      
      // Mock API response
      return {
        success: true,
        message: "Sections updated successfully",
        data: sectionsData
      };
    } catch (error: any) {
      console.error("Error updating sections:", error);
      return {
        success: false,
        message: error.message || "Failed to update sections",
        data: sectionsData
      };
    }
  }

  /**
   * Cập nhật thông tin customers
   * @param customersData - Dữ liệu customers cần cập nhật
   * @param imageFiles - Object chứa các file logo mới
   * @returns Promise<ApiResponse<CustomersData>> Kết quả cập nhật
   */
  async updateCustomers(customersData: CustomersData, imageFiles: FileUploadMap = {}): Promise<ApiResponse<CustomersData>> {
    try {
      console.log("Updating customers data:", customersData);
      
      if (Object.keys(imageFiles).length > 0) {
        console.log("Logo files uploaded:", Object.keys(imageFiles).map(k => `${k}:${imageFiles[k].name}`).join(', '));
        // Thực hiện xử lý upload file ở đây nếu có backend
      }
      
      // Mock API response
      return {
        success: true,
        message: "Customers updated successfully",
        data: customersData
      };
    } catch (error: any) {
      console.error("Error updating customers:", error);
      return {
        success: false,
        message: error.message || "Failed to update customers",
        data: customersData
      };
    }
  }

  /**
   * Cập nhật thông tin tin tức
   * @param newsId - ID của tin tức cần cập nhật
   * @param newsData - Dữ liệu tin tức cần cập nhật
   * @param imageFile - File hình ảnh mới (nếu có)
   * @returns Promise<ApiResponse<NewsItem>> Kết quả cập nhật
   */
  async updateNews(newsId: string, newsData: NewsItem, imageFile: File | null = null): Promise<ApiResponse<NewsItem>> {
    try {
      console.log("Updating news item:", newsId, newsData);
      
      if (imageFile) {
        console.log("Image file uploaded:", imageFile.name);
        // Thực hiện xử lý upload file ở đây nếu có backend
      }
      
      // Mock API response
      return {
        success: true,
        message: "News updated successfully",
        data: newsData
      };
    } catch (error: any) {
      console.error("Error updating news:", error);
      return {
        success: false,
        message: error.message || "Failed to update news",
        data: newsData
      };
    }
  }
}

// Create a named instance
const homeServiceInstance = new HomeService();

// Export the instance
export default homeServiceInstance; 