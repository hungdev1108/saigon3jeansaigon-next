import newsApi from '@/api/newsApi';

/**
 * Service for handling news data and business logic
 */
const newsService = {
  /**
   * Get all news with pagination
   * @param {number} page - Page number
   * @param {number} limit - Number of items per page
   * @returns {Promise<Object>} - Paginated news data
   */
  getAllNews: async (page = 1, limit = 10) => {
    const response = await newsApi.getAllNews({ page, limit });
    if (response.success) {
      return response.data;
    }
    return getDefaultNewsData();
  },

  /**
   * Get all published news for "View All News" page
   * @param {number} page - Page number
   * @param {number} limit - Number of items per page
   * @returns {Promise<Object>} - Paginated news data
   */
  getAllPublishedNews: async (page = 1, limit = 12) => {
    const response = await newsApi.getAllPublishedNews({ page, limit });
    if (response.success) {
      return response.data;
    }
    return getDefaultNewsData();
  },

  /**
   * Get a single news article by slug
   * @param {string} slug - News article slug
   * @returns {Promise<Object>} - News article data
   */
  getNewsBySlug: async (slug) => {
    try {
      const response = await newsApi.getNewsBySlug(slug);
      if (response.success) {
        return response.data;
      }
      
      // If API call fails, check if we have this article in default data
      const defaultNews = getDefaultNewsData().news;
      const defaultArticle = defaultNews.find(article => article.slug === slug);
      if (defaultArticle) {
        return defaultArticle;
      }
      
      return null;
    } catch (error) {
      console.error(`Error in getNewsBySlug: ${error.message}`);
      
      // Try to return default article as fallback
      const defaultNews = getDefaultNewsData().news;
      const defaultArticle = defaultNews.find(article => article.slug === slug);
      if (defaultArticle) {
        return defaultArticle;
      }
      
      return null;
    }
  },

  /**
   * Get featured news articles
   * @param {number} limit - Number of featured articles to retrieve
   * @returns {Promise<Array>} - Featured news data
   */
  getFeaturedNews: async (limit = 3) => {
    const response = await newsApi.getFeaturedNews(limit);
    if (response.success) {
      return response.data.news;
    }
    return getDefaultNewsData().news.filter(item => item.isFeatured).slice(0, limit);
  },

  /**
   * Get default news data for fallback
   * @returns {Object} - Default news data
   */
  getDefaultNewsData: () => {
    return getDefaultNewsData();
  }
};

/**
 * Get default news data for fallback
 * @returns {Object} - Default news data
 */
function getDefaultNewsData() {
  return {
    news: [
      {
        id: '1',
        title: 'Saigon 3 Jean tham gia hội chợ dệt may quốc tế 2023',
        content: 'Saigon 3 Jean đã tham gia hội chợ dệt may quốc tế 2023 và giới thiệu các sản phẩm mới nhất của công ty.',
        excerpt: 'Saigon 3 Jean đã tham gia hội chợ dệt may quốc tế 2023...',
        image: '/images/news/post_1.jpg',
        slug: 'saigon-3-jean-tham-gia-hoi-cho-det-may-quoc-te-2023',
        publishDate: '2023-10-15',
        isPublished: true,
        isFeatured: false,
        tags: ['hội chợ', 'dệt may', 'sự kiện'],
        author: 'Saigon 3 Jean'
      },
      {
        id: '2',
        title: 'SAIGON 3 JEAN ACHIEVES LEED GOLD CERTIFICATION FOR GREEN MANUFACTURING',
        content: 'Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification, reinforcing our commitment to sustainable development and environmental responsibility.',
        excerpt: 'Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification...',
        image: '/images/news/post_2.png',
        slug: 'leed-gold-certification',
        publishDate: '2023-05-08',
        isPublished: true,
        isFeatured: true,
        tags: ['sustainability', 'certification'],
        author: 'Saigon 3 Jean'
      },
      {
        id: '3',
        title: 'Saigon 3 Jean ra mắt dòng sản phẩm denim thân thiện với môi trường',
        content: 'Saigon 3 Jean vừa ra mắt dòng sản phẩm denim mới thân thiện với môi trường, sử dụng công nghệ tiết kiệm nước và năng lượng.',
        excerpt: 'Saigon 3 Jean vừa ra mắt dòng sản phẩm denim mới thân thiện với môi trường...',
        image: '/images/news/post_3.jpg',
        slug: 'saigon-3-jean-ra-mat-dong-san-pham-denim-than-thien-voi-moi-truong',
        publishDate: '2023-08-20',
        isPublished: true,
        isFeatured: false,
        tags: ['sản phẩm mới', 'thân thiện môi trường', 'denim'],
        author: 'Saigon 3 Jean'
      },
      {
        id: '4',
        title: 'Saigon 3 Jean hợp tác với các thương hiệu thời trang hàng đầu',
        content: 'Saigon 3 Jean đã ký kết hợp tác với nhiều thương hiệu thời trang hàng đầu thế giới để cung cấp vải denim chất lượng cao.',
        excerpt: 'Saigon 3 Jean đã ký kết hợp tác với nhiều thương hiệu thời trang hàng đầu thế giới...',
        image: '/images/news/post_4.png',
        slug: 'saigon-3-jean-hop-tac-voi-cac-thuong-hieu-thoi-trang-hang-dau',
        publishDate: '2023-09-05',
        isPublished: true,
        isFeatured: false,
        tags: ['hợp tác', 'thương hiệu', 'thời trang'],
        author: 'Saigon 3 Jean'
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 4,
      limit: 10
    }
  };
}

export default newsService; 