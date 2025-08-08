import contactApi from "../api/contactApi";
import { BACKEND_DOMAIN } from '@/api/config';

/**
 * Service để xử lý dữ liệu contact
 */
class ContactService {
  
  /**
   * Get auth headers for admin requests
   */
  getAuthHeaders(isFormData = false) {
    const headers = {};
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }
  /**
   * Lấy và xử lý tất cả dữ liệu cho trang contact
   * @returns {Promise<Object>} Dữ liệu đã được xử lý
   */
  async getCompleteContactData() {
    try {
      const response = await contactApi.getContactData();

      if (!response.success) {
        throw new Error("Failed to fetch contact data");
      }

      // Sửa lại để xử lý đúng cấu trúc dữ liệu từ API
      const contactInfo = response.contactInfo;

      // Xử lý và format dữ liệu
      return {
        pageTitle: "Contact Us - Saigon 3 Jean",
        pageDescription: "Get in touch with Saigon 3 Jean for all your denim manufacturing needs",
        contactInfo: this.processContactInfo(contactInfo),
        seo: this.getDefaultSeoData(),
      };
    } catch (error) {
      console.error(
        "ContactService - Error getting complete contact data:",
        error
      );
      // Trả về dữ liệu mặc định nếu API fail
      return this.getDefaultContactData();
    }
  }

  /**
   * Xử lý dữ liệu contact info
   * @param {Object} contactData - Dữ liệu contact từ API
   * @returns {Object} Dữ liệu contact đã xử lý
   */
  processContactInfo(contactData) {
    if (!contactData) return this.getDefaultContactInfo();

    return {
      id: contactData._id || "",
      bannerImage: contactData.bannerImage || "",
      address1: contactData.address1 || "", // 🔥 Sửa từ address thành address1
      address2: contactData.address2 || "", // 🔥 Thêm address2
      email: contactData.email || "",
      phone: contactData.phone || "",
      workingHours: contactData.workingHours || "",
      mapEmbedUrl: contactData.mapEmbedUrl || "",
      socialLinks: this.processSocialLinks(contactData.socialLinks),
      isActive: contactData.isActive !== false,
      createdAt: contactData.createdAt || "",
      updatedAt: contactData.updatedAt || "",
    };
  }

  /**
   * Xử lý dữ liệu social links
   * @param {Object} socialLinksData - Dữ liệu social links từ API
   * @returns {Object} Dữ liệu social links đã xử lý
   */
  processSocialLinks(socialLinksData) {
    if (!socialLinksData) return this.getDefaultSocialLinks();

    return {
      facebook: socialLinksData.facebook || "",
      linkedin: socialLinksData.linkedin || "",
      twitter: socialLinksData.twitter || "",
      instagram: socialLinksData.instagram || "",
      youtube: socialLinksData.youtube || "",
    };
  }

  /**
   * Xử lý dữ liệu SEO
   * @param {Object} seoData - Dữ liệu SEO từ API
   * @returns {Object} Dữ liệu SEO đã xử lý
   */
  processSeoData(seoData) {
    if (!seoData) return this.getDefaultSeoData();

    return {
      metaTitle: seoData.metaTitle || "Contact Us - Saigon 3 Jean",
      metaDescription:
        seoData.metaDescription ||
        "Get in touch with Saigon 3 Jean for all your denim manufacturing needs. Contact us today for inquiries and partnerships.",
      keywords: Array.isArray(seoData.keywords)
        ? seoData.keywords
        : [
            "contact",
            "saigon 3 jean",
            "denim manufacturing",
            "vietnam",
            "textile",
          ],
    };
  }

  /**
   * Lấy thông tin contact riêng biệt
   * @returns {Promise<Object>} Thông tin contact
   */
  async getContactInfo() {
    try {
      const response = await contactApi.getContactInfo();
      if (!response.success) {
        throw new Error("Failed to fetch contact info");
      }
      return this.processContactInfo(response.contactInfo);
    } catch (error) {
      console.error("ContactService - Error getting contact info:", error);
      return this.getDefaultContactInfo();
    }
  }

  /**
   * Cập nhật contact info (Admin)
   * @param {Object} contactData - Dữ liệu contact cần cập nhật
   * @param {File} bannerFile - File banner image (optional)
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  async updateContactInfo(contactData, bannerFile = null) {
    try {
      const formData = new FormData();
      
      // Append contact data
      Object.keys(contactData).forEach(key => {
        if (contactData[key] !== undefined && contactData[key] !== null) {
          if (key === 'socialLinks') {
            // Convert socialLinks object to JSON string
            formData.append(key, JSON.stringify(contactData[key]));
          } else {
            formData.append(key, contactData[key]);
          }
        }
      });
      
      // Append banner file if provided
      if (bannerFile) {
        formData.append('bannerImage', bannerFile);
      }
      
      console.log('ContactService - Updating contact info:', contactData);
      console.log('ContactService - socialLinks object:', contactData.socialLinks);
      
      const response = await fetch(`${BACKEND_DOMAIN}/api/contact/info`, {
        method: 'PUT',
        headers: this.getAuthHeaders(true), // isFormData = true
        body: formData,
      });
      
      const result = await response.json();
      console.log('ContactService - Update result:', result);
      
      return result;
    } catch (error) {
      console.error('ContactService - Error updating contact info:', error);
      throw error;
    }
  }

  /**
   * Tạo submission mới
   * @param {string} name - Tên
   * @param {string} company - Công ty
   * @param {string} email - Email
   * @param {string} phone - Số điện thoại
   * @param {string} subject - Chủ đề
   * @param {string} message - Tin nhắn
   * @returns {Promise<Object>} Kết quả tạo submission
   */
  async createSubmission(name, company, email, phone, subject, message) {
    try {
      const submissionData = {
        name,
        company,
        email,
        phone,
        subject,
        message,
      };
      const response = await contactApi.createSubmission(submissionData);
      return response;
    } catch (error) {
      console.error("ContactService - Error creating submission:", error);
      throw error;
    }
  }

  // Legacy support - giữ method cũ để không break existing code
  async LoadContactInfo() {
    try {
      const response = await contactApi.LoadContactInfo();
      return response;
    } catch (error) {
      console.error("ContactService - Error loading contact info:", error);
      // Trả về dữ liệu mặc định khi có lỗi
      return {
        success: true,
        data: this.getDefaultContactInfo(),
      };
    }
  }

  // Dữ liệu mặc định khi API fail
  getDefaultContactData() {
    return {
      pageTitle: "Contact Us - Saigon 3 Jean",
      pageDescription: "Get in touch with Saigon 3 Jean for all your denim manufacturing needs",
      contactInfo: this.getDefaultContactInfo(),
      seo: this.getDefaultSeoData(),
    };
  }

  getDefaultContactInfo() {
    return {
      id: "default",
      bannerImage: "/uploads/images/contact-page/banner_contact.png",
      address1: "47 Đường số 17, Khu phố 3, P. Hiệp Bình Phước, TP. Thủ Đức, TP. HCM, Việt Nam",
      address2: "N2-D2 Street, Nhon Trach Textile and Garment Industrial Park, Nhon Trach, Dong Nai Province, Vietnam",
      email: "hr@saigon3jean.com.vn",
      phone: "(+84) 28 3940 1234",
      workingHours: "Monday - Friday: 8:00 AM - 5:00 PM",
      mapEmbedUrl: "",
      socialLinks: this.getDefaultSocialLinks(),
      isActive: true,
    };
  }

  getDefaultSocialLinks() {
    return {
      facebook: "https://facebook.com/saigon3jeans",
      instagram: "https://instagram.com/saigon3jeans",
      youtube: "https://youtube.com/@saigon3jeans",
    };
  }

  getDefaultSeoData() {
    return {
      metaTitle: "Contact Us - Saigon 3 Jean",
      metaDescription:
        "Get in touch with Saigon 3 Jean for all your denim manufacturing needs. Contact us today for inquiries and partnerships.",
      keywords: [
        "contact",
        "saigon 3 jean",
        "denim manufacturing",
        "vietnam",
        "textile",
      ],
    };
  }
}

// Export instance của service
const contactService = new ContactService();
export default contactService;