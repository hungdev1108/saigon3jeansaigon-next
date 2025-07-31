import authService from "./authService";
import { BACKEND_DOMAIN } from '@/api/config';

const getAuthHeaders = (isFormData = false) => {
  const token = authService.getToken();
  if (!token) {
    // Handle case where user is not logged in
    console.error("No auth token found. User might be logged out.");
    // Optionally redirect to login or throw an error
    return {};
  }
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

/**
 * Service để xử lý dữ liệu home
 */
class HomeService {
  /**
   * Lấy tất cả dữ liệu cho trang chủ
   * @returns {Promise<Object>} Dữ liệu trang chủ đã xử lý
   */
  async getCompleteHomeData() {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/data`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch home data: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to fetch home data");
      }

      const { data } = result;
      // Không gộp nữa, trả về riêng biệt
      return {
        hero: this.processHeroData(data.hero),
        sections: this.processSectionsData(data.sections),
        customers: this.processCustomersData(data.customers),
        certifications: this.processCertificationsData(data.certifications),
        featuredNews: this.processNewsData(data.featuredNews),
        regularNews: this.processNewsData(data.regularNews),
      };
    } catch (error) {
      console.error("❌ HomeService - Error getting home data:", error.message);
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
        _id: customer._id || "",
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
    if (!Array.isArray(newsData)) return [];

    return newsData.map((news) => ({
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

  getDefaultNewsData() {
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
   * @param {Object} heroData - Dữ liệu hero cần cập nhật
   * @param {Object} files - Object chứa các file (backgroundImage, videoUrl)
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateHero(heroData, files = {}) {
    const formData = new FormData();
    Object.keys(heroData).forEach(key => formData.append(key, heroData[key]));
    
    // Xử lý files
    if (files['backgroundImage']) {
      formData.append('heroImage', files['backgroundImage']);
    }
    
    if (files['videoUrl']) {
      formData.append('heroVideo', files['videoUrl']);
    }

    const response = await fetch(`${BACKEND_DOMAIN}/api/home/hero`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: formData,
    });
    return response.json();
  }

  /**
   * Cập nhật thông tin các sections
   * @param {Array} sectionsData - Dữ liệu sections cần cập nhật
   * @param {Object} files - Object chứa các file hình ảnh mới
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateHomeSections(sectionsData, files = {}) {
    const formData = new FormData();
    formData.append('sections', JSON.stringify(sectionsData));
    
    console.log('Files to upload:', Object.keys(files));
    
    // Xử lý files theo đúng định dạng mà backend mong đợi
    Object.keys(files).forEach(key => {
      if (files[key]) {
        // Kiểm tra nếu key có định dạng 'sections-{index}-mediaUrl'
        const match = key.match(/sections-(\d+)-mediaUrl/);
        if (match && match[1]) {
          const index = match[1];
          // Gửi file với tên trường đúng định dạng của backend
          formData.append(`card_${index}`, files[key]);
          console.log(`Appending file with field name: card_${index}`);
        } else {
          // Fallback cho các trường hợp khác (nếu có)
          formData.append(key, files[key]);
          console.log(`Appending file with original field name: ${key}`);
        }
      }
    });

    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/sections`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error updating home sections:", error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin customers
   * @param {Object} customersData - Dữ liệu customers cần cập nhật
   * @param {Object} imageFiles - Object chứa các file logo mới
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateCustomers(customersData, files = {}) {
    const formData = new FormData();
    formData.append('customers', JSON.stringify(customersData));
    
    console.log('Files to upload for customers:', Object.keys(files));
    
    // Process files before appending to formData
    Object.keys(files).forEach(key => {
      if(files[key]) {
        // Xử lý đặc biệt cho khách hàng mới có ID tạm thời
        if (key.includes('temp_')) {
          // Trích xuất danh mục (denimWoven hoặc knit)
          let category = 'denimWoven'; // Giá trị mặc định
          
          if (key.includes('denimWoven')) {
            category = 'denimWoven';
          } else if (key.includes('knit')) {
            category = 'knit';
          }
          
          // Sử dụng tên trường đơn giản hóa cho khách hàng mới
          const newKey = `${category}_new`;
          formData.append(newKey, files[key]);
          console.log(`Appending file with simplified field name: ${newKey} (original: ${key})`);
        } else {
          // Đối với khách hàng hiện có, sử dụng tên trường gốc
          formData.append(key, files[key]);
          console.log(`Appending file with field name: ${key}`);
        }
      }
    });

    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/customers`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error updating customers:", error);
      throw error;
    }
  }

  /**
   * Xóa một khách hàng
   * @param {string} category - Danh mục khách hàng (denimWoven hoặc knit)
   * @param {string} id - ID của khách hàng cần xóa
   * @returns {Promise<Object>} Kết quả xóa
   */
  async deleteCustomer(category, id) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/customers/${category}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error deleting customer ${id} from ${category}:`, error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin tin tức
   * @param {string} newsId - ID của tin tức cần cập nhật
   * @param {Object} newsData - Dữ liệu tin tức cần cập nhật
   * @param {File} imageFile - File hình ảnh mới (nếu có)
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateNews(newsId, newsData, newsImage) {
    const formData = new FormData();
    if (Array.isArray(newsData.tags)) {
        newsData.tags = newsData.tags.join(',');
    }
    Object.keys(newsData).forEach(key => formData.append(key, newsData[key]));
    if (newsImage) formData.append('newsImage', newsImage);
    
    const response = await fetch(`${BACKEND_DOMAIN}/api/home/news/${newsId}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: formData
    });
    return response.json();
  }

  async deleteNews(id) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/news/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    } catch (error) {
      console.error(`❌ HomeService - Error deleting news ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy TẤT CẢ tin tức cho trang admin (không filter)
   * @returns {Promise<Array>}
   */
  async getHomepageNews() {
    try {
      // Temporarily use the admin endpoint to get ALL news
      // This allows managing featured status even for unpublished news
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/admin/news`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch homepage news: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("API response for news:", result);
      
      // Kiểm tra cấu trúc dữ liệu trả về
      if (result.success && result.data) {
        // Kiểm tra nếu data chứa thuộc tính news (cấu trúc mới)
        if (result.data.news && Array.isArray(result.data.news)) {
          return result.data.news;
        }
        // Nếu data là một mảng trực tiếp
        else if (Array.isArray(result.data)) {
          return result.data;
        }
      }
      
      console.warn("Unexpected API response structure:", result);
      return [];
    } catch (error) {
      console.error("❌ HomeService - Error getting homepage news:", error);
      return [];
    }
  }

  /**
   * Upload video cho hero section
   * @param {File} videoFile - File video cần upload
   * @returns {Promise<Object>} Kết quả upload
   */
  async uploadHeroVideo(videoFile) {
    try {
      const formData = new FormData();
      formData.append('heroVideo', videoFile);

      const response = await fetch(`${BACKEND_DOMAIN}/api/home/hero/video`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("❌ HomeService - Error uploading hero video:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết tin tức theo ID
   * @param {string} id - ID của tin tức cần lấy
   * @returns {Promise<Object>} Thông tin chi tiết tin tức
   */
  async getNewsById(id) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/news/${id}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`❌ HomeService - Error getting news ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo tin tức mới
   * @param {FormData} formData - Form data chứa thông tin tin tức và hình ảnh
   * @returns {Promise<Object>} Kết quả tạo tin tức
   */
  async createNews(formData) {
    try {
      // Log thông tin về FormData trước khi gửi
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        if (key === 'newsImage') {
          console.log(`${key}: File name=${value.name}, type=${value.type}, size=${value.size}bytes`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/news`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Create news response:", result);
      return result;
    } catch (error) {
      console.error("❌ HomeService - Error creating news:", error);
      throw error;
    }
  }

  async getNews(options = {}) {
    const { featured, limit, page, admin } = options;
    const queryParams = new URLSearchParams();
    if (featured) queryParams.append('featured', 'true');
    if (limit) queryParams.append('limit', limit.toString());
    if (page) queryParams.append('page', page.toString());
    if (admin) queryParams.append('admin', 'true');
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/news${queryString}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.success ? result.data.news || result.data : [];
    } catch (error) {
      console.error("❌ HomeService - Error getting news:", error.message);
      return [];
    }
  }
}

const homeService = new HomeService();
export default homeService;
