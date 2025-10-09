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
      
      // Xử lý dữ liệu sections để đảm bảo cấu trúc đúng
      let sectionsData = [];
      let factoryVideo = "";
      
      if (data.sections) {
        if (data.sections.sections && Array.isArray(data.sections.sections)) {
          sectionsData = data.sections.sections;
          factoryVideo = data.sections.factoryVideo || "";
        } else if (Array.isArray(data.sections)) {
          sectionsData = data.sections;
        }
      }
      
      console.log("API data:", data);
      console.log("Processed sections:", sectionsData);
      console.log("Factory video:", factoryVideo);
      
      // Sử dụng dữ liệu trực tiếp từ API
      return {
        hero: data.hero || this.getDefaultHeroData(),
        sections: sectionsData || [],
        factoryVideo: data.factoryVideo || factoryVideo || "",
        customers: data.customers || this.getDefaultCustomersData(),
        certifications: data.certifications || this.getDefaultCertificationsData(),
        featuredNews: data.featuredNews || [],
        regularNews: data.regularNews || [],
        homeContact: data.homeContact || this.getDefaultHomeContactData(),
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

    // Sử dụng dữ liệu trực tiếp từ API
    return heroData;
  }

  /**
   * Xử lý dữ liệu sections (3 cards)
   * @param {Object} sectionsData - Dữ liệu sections từ API
   * @returns {Object} Dữ liệu sections đã xử lý
   */
  processSectionsData(sectionsData) {
    // Sử dụng dữ liệu trực tiếp từ API
    // Check if we have the new format with sections and factoryVideo
    if (sectionsData && sectionsData.sections && Array.isArray(sectionsData.sections)) {
      return {
        sections: sectionsData.sections.sort((a, b) => (a.order || 0) - (b.order || 0)),
        factoryVideo: sectionsData.factoryVideo || ""
      };
    }
    
    // For backward compatibility with old format
    if (Array.isArray(sectionsData)) {
      return {
        sections: sectionsData.sort((a, b) => (a.order || 0) - (b.order || 0)),
        factoryVideo: ""
      };
    }
    
    // Default case
    return {
      sections: this.getDefaultSectionsData(),
      factoryVideo: ""
    };
  }

  /**
   * Xử lý dữ liệu customers
   * @param {Object} customersData - Dữ liệu customers từ API
   * @returns {Object} Dữ liệu customers đã xử lý
   */
  processCustomersData(customersData) {
    if (!customersData) return this.getDefaultCustomersData();

    // Sử dụng dữ liệu trực tiếp từ API
    return customersData;
  }

  /**
   * Xử lý danh sách customer
   * @param {Array} customerList - Danh sách customer
   * @returns {Array} Danh sách customer đã xử lý
   */
  processCustomerList(customerList) {
    if (!Array.isArray(customerList)) return [];

    // Sử dụng dữ liệu trực tiếp từ API, chỉ sắp xếp theo thứ tự
    return customerList.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Xử lý dữ liệu certifications
   * @param {Array} certificationsData - Dữ liệu certifications từ API
   * @returns {Array} Dữ liệu certifications đã xử lý
   */
  processCertificationsData(certificationsData) {
    if (!Array.isArray(certificationsData))
      return this.getDefaultCertificationsData();

    // Sử dụng dữ liệu trực tiếp từ API, chỉ sắp xếp theo thứ tự
    return certificationsData.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Xử lý dữ liệu news
   * @param {Array} newsData - Dữ liệu news từ API
   * @returns {Array} Dữ liệu news đã xử lý
   */
  processNewsData(newsData) {
    if (!Array.isArray(newsData)) return [];

    // Sử dụng dữ liệu trực tiếp từ API
    return newsData;
  }

  // Dữ liệu mặc định khi API fail
  getDefaultHomeData() {
    console.log("Getting default home data including homeContact");
    return {
      hero: this.getDefaultHeroData(),
      sections: this.getDefaultSectionsData().sections,
      factoryVideo: "",
      customers: this.getDefaultCustomersData(),
      certifications: this.getDefaultCertificationsData(),
      featuredNews: this.getDefaultNewsData(),
      homeContact: this.getDefaultHomeContactData(),
    };
  }
  
  getDefaultHomeContactData() {
    console.log("Creating default HomeContact data");
    const defaultData = {
      contact: {
        title: "CONTACT",
        description: "Seeking us and you'll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint",
        buttonText: "CONTACT US",
        buttonLink: "/contact"
      },
      workWithUs: {
        title: "WORK WITH US",
        description: "We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company",
        buttonText: "LEARN MORE",
        buttonLink: "/recruitment"
      },
      isActive: true
    };
    console.log("Default HomeContact data:", defaultData);
    return defaultData;
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
    Object.keys(heroData).forEach(key => {
      // KHÔNG append aiBannerImage nếu có file upload
      if (key === 'aiBannerImage' && files['aiBannerImage']) return;
      formData.append(key, heroData[key]);
    });
    // Append file nếu có
    if (files['aiBannerImage']) {
      formData.append('aiBannerImage', files['aiBannerImage']);
    }
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
    
    // Check if sectionsData is an object with sections property (new format)
    if (sectionsData && sectionsData.sections) {
      formData.append('sections', JSON.stringify(sectionsData.sections));
      
      // Xử lý factoryVideo nếu có
      if (sectionsData.factoryVideo !== undefined) {
        const fv = sectionsData.factoryVideo;
        const isYoutube = typeof fv === 'string' && (fv.includes('youtube.com/watch?v=') || fv.includes('youtu.be/'));
        // Tránh đụng tên field file 'factoryVideo' của multer: gửi URL qua field khác
        if (isYoutube) {
          formData.append('factoryVideoUrl', fv);
        } else {
          formData.append('factoryVideo', fv);
        }
      }
    } else {
      // Backward compatibility
      formData.append('sections', JSON.stringify(sectionsData));
    }
    
    console.log('Sections data to save:', sectionsData);
    console.log('Files to upload:', Object.keys(files));
    
    // Xử lý files theo đúng định dạng mà backend mong đợi
    Object.keys(files).forEach(key => {
      if (files[key]) {
        // Handle factory video upload
        if (key === 'factoryVideo') {
          formData.append('factoryVideo', files[key]);
          console.log('Appending factory video file');
        }
        // Kiểm tra nếu key có định dạng 'sections-{index}-mediaUrl'
        else {
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
  async updateNews(newsId, newsData, mainImageFile, additionalImageFiles) {
    const formData = new FormData();

    const title = newsData?.title ?? '';
    const content = typeof newsData?.content === 'string' ? newsData.content : '';
    const excerpt = newsData?.excerpt ?? '';
    const tags = Array.isArray(newsData?.tags) ? newsData.tags.join(',') : (typeof newsData?.tags === 'string' ? newsData.tags : '');
    const isPublished = newsData?.isPublished === true || newsData?.isPublished === 'true' ? 'true' : 'false';
    const isFeatured = newsData?.isFeatured === true || newsData?.isFeatured === 'true' ? 'true' : 'false';
    const onHome = newsData?.onHome === true || newsData?.onHome === 'true' ? 'true' : 'false';
    const publishDate = newsData?.publishDate ? String(newsData.publishDate) : '';
    const author = newsData?.author ?? '';

    // Append explicit fields to avoid dropping values
    formData.append('title', title);
    formData.append('content', content);
    formData.append('excerpt', excerpt);
    if (tags) formData.append('tags', tags);
    formData.append('isPublished', isPublished);
    formData.append('isFeatured', isFeatured);
    formData.append('onHome', onHome);
    if (publishDate) formData.append('publishDate', publishDate);
    if (author) formData.append('author', author);

    if (mainImageFile) {
      formData.append('newsImage', mainImageFile);
    }

    // Request
    const response = await fetch(`${BACKEND_DOMAIN}/api/home/news/${newsId}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update news: ${response.status} ${text}`);
    }
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
   * Get home contact section
   * @returns {Promise<Object>} Home contact data
   */
  async getHomeContact() {
    try {
      console.log("HomeService - Getting home contact data");
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/contact-section`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        console.error(`❌ HomeService - Failed to fetch home contact data: ${response.statusText}`);
        throw new Error(`Failed to fetch home contact data: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("HomeService - Home contact data received:", result);
      return result;
    } catch (error) {
      console.error("❌ HomeService - Error getting home contact data:", error.message);
      return { 
        success: false, 
        data: this.getDefaultHomeContactData(),
        error: error.message
      };
    }
  }
  
  /**
   * Update home contact section
   * @param {Object} contactData - Contact section data to update
   * @returns {Promise<Object>} Update result
   */
  async updateHomeContact(contactData) {
    try {
      console.log("HomeService - Updating home contact with data:", contactData);
      
      // Ensure contactData has the correct structure
      const dataToSend = {
        contact: contactData.contact || {},
        workWithUs: contactData.workWithUs || {},
        isActive: contactData.isActive !== undefined ? contactData.isActive : true
      };
      
      console.log("HomeService - Sending data to API:", dataToSend);
      
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/contact-section`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HomeService - API error response:", errorText);
        throw new Error(`Failed to update home contact: ${response.statusText}. ${errorText}`);
      }
      
      const result = await response.json();
      console.log("HomeService - API success response:", result);
      return result;
    } catch (error) {
      console.error("❌ HomeService - Error updating home contact:", error.message);
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

  async updateCertifications(certifications, files = {}) {
    try {
      const formData = new FormData();
      formData.append('certifications', JSON.stringify(certifications));
      Object.keys(files).forEach(key => {
        formData.append(key, files[key]);
      });
      const response = await fetch(`${BACKEND_DOMAIN}/api/home/certifications`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update certifications');
      return await response.json();
    } catch (error) {
      console.error('Error updating certifications:', error);
      throw error;
    }
  }
}

const homeService = new HomeService();
export default homeService;
