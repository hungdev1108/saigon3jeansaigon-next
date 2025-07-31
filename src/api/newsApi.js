import { BACKEND_DOMAIN } from './config';

/**
 * Get all news articles
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @param {boolean} params.featured - Filter by featured news
 * @returns {Promise<Object>} - News data
 */
export const getAllNews = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.featured !== undefined) queryParams.append('featured', params.featured);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${BACKEND_DOMAIN}/api/home/news${query}`, {
      cache: 'no-store'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return { success: false, error: 'Failed to fetch news' };
  }
};

/**
 * Get all published news for "View All News" page
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @returns {Promise<Object>} - News data
 */
export const getAllPublishedNews = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${BACKEND_DOMAIN}/api/home/news/all${query}`, {
      cache: 'no-store'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all published news:', error);
    return { success: false, error: 'Failed to fetch news' };
  }
};

/**
 * Get a single news article by slug
 * @param {string} slug - News article slug
 * @returns {Promise<Object>} - News article data
 */
export const getNewsBySlug = async (slug) => {
  try {
    const response = await fetch(`${BACKEND_DOMAIN}/api/home/news/${slug}`, {
      cache: 'no-store'
    });
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching news article with slug ${slug}:`, error);
    return { success: false, error: 'Failed to fetch news article' };
  }
};

/**
 * Get featured news articles
 * @param {number} limit - Number of featured articles to retrieve
 * @returns {Promise<Object>} - Featured news data
 */
export const getFeaturedNews = async (limit = 3) => {
  return getAllNews({ featured: true, limit });
};

export default {
  getAllNews,
  getAllPublishedNews,
  getNewsBySlug,
  getFeaturedNews
}; 